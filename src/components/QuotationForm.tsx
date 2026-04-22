import React, { useRef } from 'react';
import { Plus, Trash2, Building2, User, FileText, Settings2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { CompanyDetails, ClientDetails, LineItem, Quotation } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  quotation: Quotation;
  onUpdate: (quotation: Quotation) => void;
}

export default function QuotationForm({ quotation, onUpdate }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateCompany = (details: Partial<CompanyDetails>) => {
    onUpdate({ ...quotation, company: { ...quotation.company, ...details } });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCompany({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    updateCompany({ logoUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateClient = (details: Partial<ClientDetails>) => {
    onUpdate({ ...quotation, client: { ...quotation.client, ...details } });
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    onUpdate({ ...quotation, items: [...quotation.items, newItem] });
  };

  const updateItem = (id: string, updates: Partial<LineItem>) => {
    const newItems = quotation.items.map((item) => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      }
      return item;
    });
    
    const subtotal = newItems.reduce((acc, item) => acc + item.total, 0);
    const taxAmount = subtotal * (quotation.taxRate / 100);
    
    onUpdate({
      ...quotation,
      items: newItems,
      subtotal,
      taxAmount,
      total: subtotal + taxAmount,
    });
  };

  const removeItem = (id: string) => {
    const newItems = quotation.items.filter((item) => item.id !== id);
    const subtotal = newItems.reduce((acc, item) => acc + item.total, 0);
    const taxAmount = subtotal * (quotation.taxRate / 100);
    
    onUpdate({
      ...quotation,
      items: newItems,
      subtotal,
      taxAmount,
      total: subtotal + taxAmount,
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      {/* Company Details */}
      <section className="card-premium p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <Building2 className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold">بيانات المؤسسة</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-standard">اسم المؤسسة</label>
            <input
              type="text"
              className="input-standard"
              value={quotation.company.name}
              onChange={(e) => updateCompany({ name: e.target.value })}
              placeholder="مثال: شركة الحلول الذكية"
            />
          </div>
          <div>
            <label className="label-standard">رقم الهاتف</label>
            <input
              type="text"
              className="input-standard"
              value={quotation.company.phone}
              onChange={(e) => updateCompany({ phone: e.target.value })}
              placeholder="05xxxxxxx"
            />
          </div>
          <div>
            <label className="label-standard">البريد الإلكتروني</label>
            <input
              type="email"
              className="input-standard"
              value={quotation.company.email}
              onChange={(e) => updateCompany({ email: e.target.value })}
              placeholder="info@company.com"
            />
          </div>
          <div>
            <label className="label-standard">العنوان</label>
            <input
              type="text"
              className="input-standard"
              value={quotation.company.address}
              onChange={(e) => updateCompany({ address: e.target.value })}
              placeholder="الرياض، المملكة العربية السعودية"
            />
          </div>
          <div>
            <label className="label-standard">الرقم الضريبي (اختياري)</label>
            <input
              type="text"
              className="input-standard"
              value={quotation.company.taxNumber || ''}
              onChange={(e) => updateCompany({ taxNumber: e.target.value })}
              placeholder="3xxxxxxxxxxxxxx"
            />
          </div>
          <div className="md:col-span-2">
            <label className="label-standard">شعار المؤسسة</label>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-24 h-24 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden relative group">
                {quotation.company.logoUrl ? (
                  <>
                    <img 
                      src={quotation.company.logoUrl} 
                      alt="Logo Preview" 
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={removeLogo}
                      className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-200" />
                )}
              </div>
              
              <div className="flex-grow space-y-3 w-full">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    رفع صورة الشعار
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  {quotation.company.logoUrl && (
                    <button
                      onClick={removeLogo}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف الشعار
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold uppercase">أو رابط URL</span>
                  <input
                    type="text"
                    className="input-standard pr-20"
                    value={quotation.company.logoUrl || ''}
                    onChange={(e) => updateCompany({ logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Details */}
      <section className="card-premium p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <User className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold">بيانات العميل</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-standard">اسم العميل / الجهة</label>
            <input
              type="text"
              className="input-standard"
              value={quotation.client.name}
              onChange={(e) => updateClient({ name: e.target.value })}
              placeholder="اسم المؤسسة أو الشخص المستلم"
            />
          </div>
          <div>
            <label className="label-standard">رقم الهاتف</label>
            <input
              type="text"
              className="input-standard"
              value={quotation.client.phone}
              onChange={(e) => updateClient({ phone: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label-standard">العنوان</label>
            <input
              type="text"
              className="input-standard"
              value={quotation.client.address}
              onChange={(e) => updateClient({ address: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* Line Items */}
      <section className="card-premium p-6">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold">بنود العرض</h2>
          </div>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-sm font-bold"
          >
            <Plus className="w-4 h-4" />
            إضافة بند
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {quotation.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-12 gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100 relative group"
              >
                <div className="col-span-12 md:col-span-6">
                  <label className="label-standard">الوصف</label>
                  <input
                    type="text"
                    className="input-standard"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    placeholder="وصف الخدمة أو المنتج"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <label className="label-standard">الكمية</label>
                  <input
                    type="number"
                    className="input-standard text-center"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <label className="label-standard">سعر الوحدة</label>
                  <input
                    type="number"
                    className="input-standard text-center"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-span-4 md:col-span-2 flex flex-col justify-end">
                  <label className="label-standard">الإجمالي</label>
                  <div className="h-[42px] flex items-center justify-center font-bold text-gray-700 bg-gray-100 rounded-xl">
                    {(item.total).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute -left-2 -top-2 md:opacity-0 group-hover:opacity-100 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {quotation.items.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
              <p className="text-gray-400">لا توجد بنود حالياً. اضغط على "إضافة بند" للبدء.</p>
            </div>
          )}
        </div>
      </section>

      {/* Settings & Totals */}
      <section className="card-premium p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <Settings2 className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold">الإعدادات والمجاميع</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="label-standard">نسبة الضريبة (%)</label>
              <input
                type="number"
                className="input-standard"
                value={quotation.taxRate}
                onChange={(e) => {
                  const rate = parseFloat(e.target.value) || 0;
                  const taxAmount = quotation.subtotal * (rate / 100);
                  onUpdate({
                    ...quotation,
                    taxRate: rate,
                    taxAmount,
                    total: quotation.subtotal + taxAmount
                  });
                }}
              />
            </div>
            <div>
              <label className="label-standard">تاريخ العرض</label>
              <input
                type="date"
                className="input-standard"
                value={quotation.date}
                onChange={(e) => onUpdate({ ...quotation, date: e.target.value })}
              />
            </div>
            <div>
              <label className="label-standard">تاريخ الصلاحية</label>
              <input
                type="date"
                className="input-standard"
                value={quotation.expiryDate}
                onChange={(e) => onUpdate({ ...quotation, expiryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">الإجمالي الفرعي:</span>
              <span className="font-bold">{quotation.subtotal.toLocaleString()} ر.س</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ضريبة القيمة المضافة ({quotation.taxRate}%):</span>
              <span className="font-bold">{quotation.taxAmount.toLocaleString()} ر.س</span>
            </div>
            <div className="h-[1px] bg-gray-200 my-2" />
            <div className="flex justify-between items-center text-xl">
              <span className="font-bold text-gray-900">الإجمالي النهائي:</span>
              <span className="font-black text-blue-600">{quotation.total.toLocaleString()} ر.س</span>
            </div>
          </div>
        </div>
      </section>

      {/* Notes & Terms */}
      <section className="card-premium p-6">
        <div className="space-y-4">
          <div>
            <label className="label-standard">ملاحظات إضافية</label>
            <textarea
              className="input-standard min-h-[100px]"
              value={quotation.notes}
              onChange={(e) => onUpdate({ ...quotation, notes: e.target.value })}
              placeholder="مثال: الأسعار تشمل التوصيل والتركيب..."
            />
          </div>
          <div>
            <label className="label-standard">الشروط والأحكام</label>
            <textarea
              className="input-standard min-h-[100px]"
              value={quotation.terms}
              onChange={(e) => onUpdate({ ...quotation, terms: e.target.value })}
              placeholder="مثال: يسري هذا العرض لمدة 15 يوماً من تاريخه..."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
