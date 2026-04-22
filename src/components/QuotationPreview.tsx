import React from 'react';
import { Quotation } from '../types';
import { Mail, Phone, MapPin, Globe, Calendar, FileText, User } from 'lucide-react';

interface Props {
  quotation: Quotation;
}

export default function QuotationPreview({ quotation }: Props) {
  const { company, client, items } = quotation;

  return (
    <div dir="rtl" className="bg-white rounded-sm border-t-[12px] border-blue-700 p-8 md:p-12 min-h-[297mm] w-[210mm] relative overflow-hidden print:p-0 print:border-t-[8px] print:m-0 text-right" id="quotation-print-area">
      {/* Decorative background element */}
      <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-blue-50 rounded-full no-print"></div>

      <header className="flex justify-between items-start mb-10 relative z-10 text-right">
        <div className="text-right">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 leading-tight">عرض سعر</h1>
          <p className="text-blue-700 font-semibold tracking-widest text-sm uppercase">QUOTATION</p>
        </div>
        
        <div className="text-left md:text-right flex flex-col items-end">
          <div className="flex items-center justify-end mb-2">
            {company.logoUrl ? (
              <img 
                src={company.logoUrl} 
                alt="Logo" 
                className="h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex items-center">
                <span className="text-2xl font-black text-blue-700">LOGO</span>
                <div className="h-8 w-1 bg-blue-700 ml-3"></div>
              </div>
            )}
          </div>
          <p className="text-slate-800 font-bold text-lg">{company.name || 'اسم المؤسسة'}</p>
          <div className="space-y-0.5 text-xs text-slate-400 font-medium">
            {company.address && <p>{company.address}</p>}
            {company.phone && <p dir="ltr">{company.phone}</p>}
            {company.email && <p>{company.email}</p>}
            {company.taxNumber && <p className="text-slate-500 font-bold mt-1">الرقم الضريبي: {company.taxNumber}</p>}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-12 mb-10 relative z-10">
        <div className="space-y-3">
          <h3 className="text-slate-400 uppercase text-[10px] font-black border-b border-slate-100 pb-1.5 mb-2 tracking-widest">معلومات العميل</h3>
          <div className="space-y-1">
            <p className="text-slate-800 font-bold text-lg">{client.name || 'اسم العميل'}</p>
            {client.phone && <p className="text-slate-600 text-sm">{client.phone}</p>}
            {client.address && <p className="text-slate-500 text-sm">{client.address}</p>}
          </div>
        </div>

        <div className="space-y-2 flex flex-col items-end">
          <div className="w-full max-w-[220px]">
            <h3 className="text-slate-400 uppercase text-[10px] font-black border-b border-slate-100 pb-1.5 mb-4 tracking-widest text-left">تفاصيل العرض</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">رقم العرض:</span>
                <span className="text-slate-800 font-mono font-bold uppercase tracking-wider">QT-{quotation.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">التاريخ:</span>
                <span className="text-slate-800 font-medium">{quotation.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">صالح لغاية:</span>
                <span className="text-slate-800 font-medium">{quotation.expiryDate}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex-grow relative z-10 mb-10">
        <table className="w-full text-right border-collapse overflow-hidden rounded-md">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-4 text-xs font-bold uppercase tracking-widest rounded-tr-md">الوصف</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-center">الكمية</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-center">السعر</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest rounded-tl-md text-left">الإجمالي</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 text-sm">
            {items.map((item, idx) => (
              <tr key={item.id} className={`border-b border-slate-100 ${idx % 2 === 1 ? 'bg-slate-50' : ''}`}>
                <td className="p-4 font-bold text-slate-800">{item.description || 'بند جديد'}</td>
                <td className="p-4 text-center font-medium">{item.quantity}</td>
                <td className="p-4 text-center text-slate-600">{item.unitPrice.toLocaleString()} ر.س</td>
                <td className="p-4 text-left font-bold text-slate-900">{item.total.toLocaleString()} ر.س</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-slate-300 italic border-b border-slate-50">لا توجد بنود عرض...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="mt-auto flex flex-col md:flex-row justify-between items-end gap-10 relative z-10 text-right">
        <div className="w-full md:w-1/2 space-y-6">
          {(quotation.notes || quotation.terms) && (
            <div className="bg-blue-50 p-5 rounded-md border-r-4 border-blue-400">
              {quotation.notes && (
                <div className="mb-4 text-right">
                  <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1.5 flex items-center justify-end gap-2 text-right">
                    <span>ملاحظات:</span>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  </h4>
                  <p className="text-[11px] text-blue-700 leading-relaxed font-medium">{quotation.notes}</p>
                </div>
              )}
              {quotation.terms && (
                <div className="text-right">
                  <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-2 flex items-center justify-end gap-2 text-right">
                    <span>الشروط والأحكام:</span>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  </h4>
                  <div className="text-[10px] text-blue-700 leading-relaxed font-medium space-y-1">
                    {quotation.terms.split('\n').map((term, i) => (
                      <p key={i} className="flex justify-end gap-2 text-right">
                        {term}
                        <span className="text-blue-300">•</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-12 mt-8 no-print">
            <div className="text-center">
              <div className="w-32 h-16 border-b-2 border-slate-200 mb-2 bg-slate-100 rounded-t-lg"></div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">ختم المؤسسة</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-16 border-b-2 border-slate-200 mb-2 bg-slate-100 rounded-t-lg"></div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">توقيع العميل</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 space-y-1 text-right">
          <div className="flex justify-between text-sm py-2 border-b border-slate-100">
            <span className="text-slate-400 font-medium">المجموع الفرعي:</span>
            <span className="text-slate-800 font-bold">{quotation.subtotal.toLocaleString()} ر.س</span>
          </div>
          <div className="flex justify-between text-sm py-2 border-b border-slate-100">
            <span className="text-slate-400 font-medium">الضريبة ({quotation.taxRate}%):</span>
            <span className="text-slate-800 font-bold">{quotation.taxAmount.toLocaleString()} ر.س</span>
          </div>
          <div className="flex justify-between items-center py-5 text-blue-800 border-t-2 border-blue-100 mt-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">الإجمالي النهائي</span>
            <span className="text-2xl font-black">{quotation.total.toLocaleString()} ر.س</span>
          </div>
          <p className="text-[9px] text-slate-400 text-left pt-2 font-bold italic tracking-wide no-print">
            يخضع هذا العرض للشروط والأحكام المذكورة أعلاه.
          </p>
        </div>
      </footer>

      {/* Signature Section for Print */}
      <div className="hidden print:grid grid-cols-2 gap-20 mt-16 pt-10 border-t border-slate-100">
        <div className="text-center">
          <p className="text-xs font-bold text-slate-400 mb-12">اعتماد العميل</p>
          <div className="h-[1px] bg-slate-200" />
          <p className="text-[10px] text-slate-300 mt-2 italic">التوقيع والختم</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-slate-400 mb-12">ختم المؤسسة / التوقيع</p>
          <div className="h-[1px] bg-slate-200" />
          <p className="text-[10px] text-slate-300 mt-2 italic">المسؤول المخول</p>
        </div>
      </div>

      <div className="mt-12 text-center text-[9px] text-slate-300 font-black uppercase tracking-[0.4em] no-print">
        {company.name || 'QUOTATION SYSTEM'} • {new Date().getFullYear()}
      </div>
    </div>
  );
}

function Building2Placeholder(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
