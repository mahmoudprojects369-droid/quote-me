import React, { useState, useEffect, useRef } from 'react';
import { Printer, RotateCcw, Eye, Edit3, Download, FilePlus, Loader2 } from 'lucide-react';
import QuotationForm from './components/QuotationForm';
import QuotationPreview from './components/QuotationPreview';
import { Quotation } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';

const STORAGE_KEY = 'ais_quotation_v1';

const INITIAL_QUOTATION: Quotation = {
  id: Math.random().toString(36).substr(2, 6).toUpperCase(),
  date: new Date().toISOString().split('T')[0],
  expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  company: {
    name: '',
    address: '',
    email: '',
    phone: '',
    taxNumber: '',
  },
  client: {
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  items: [],
  subtotal: 0,
  taxRate: 15,
  taxAmount: 0,
  total: 0,
  notes: 'الأسعار تشمل التوصيل والتركيب حسب الاتفاق.',
  terms: '1. يسري هذا العرض لمدة 15 يوماً من تاريخه.\n2. يتم دفع 50% مقدم عند التعميد و 50% عند التوريد.',
};

export default function App() {
  const [quotation, setQuotation] = useState<Quotation>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_QUOTATION;
  });
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotation));
  }, [quotation]);

  const handleReset = () => {
    if (confirm('هل أنت متأكد من مسح جميع البيانات؟')) {
      setQuotation({
        ...INITIAL_QUOTATION,
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    
    try {
      const element = document.getElementById('quotation-print-area');
      if (!element) {
        throw new Error('Print area not found');
      }

      // Small delay to ensure any dynamic content is stable
      await new Promise(resolve => setTimeout(resolve, 800));

      // Use html-to-image which handles RTL/Arabic much better than html2canvas
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 4, // Very high resolution for extra sharpness
        width: width,
        height: height,
        style: {
          transform: 'none',
          margin: '0',
          padding: '0',
          background: '#ffffff',
          width: `${width}px`,
          height: `${height}px`,
        },
        filter: (node) => {
          return !node?.classList?.contains('no-print');
        }
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // Center horizontally (should already be centered if imgWidth = pdfWidth)
      const xOffset = (pdfWidth - imgWidth) / 2;
      
      pdf.addImage(dataUrl, 'PNG', xOffset, 0, imgWidth, imgHeight);
      
      // Blob and Download for Iframe compatibility
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Quotation-${quotation.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);

      console.log('PDF generation complete via html-to-image');
    } catch (error) {
      console.error('PDF Error:', error);
      alert('نعتذر، واجهنا مشكلة في التنزيل المباشر. سنحاول فتح حوار الطباعة (يمكنك اختيار حفظ بتنسيق PDF من هناك).');
      window.focus();
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-12">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FilePlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-none">نظام عروض الأسعار</h1>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Professional Quotation System</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setView('edit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  view === 'edit' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                تعديل
              </button>
              <button
                onClick={() => setView('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  view === 'preview' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Eye className="w-4 h-4" />
                معاينة
              </button>
            </div>

            <div className="w-[1px] h-6 bg-gray-200 mx-2" />

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                title="إعادة تعيين"
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className={`flex flex-col items-center justify-center gap-1 px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${
                  isGenerating 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-blue-700 text-white shadow-blue-700/20 hover:bg-blue-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Printer className="w-4 h-4" />
                  )}
                  <span className="text-sm">
                    {isGenerating ? 'جاري التحميل...' : 'تنزيل PDF / طباعة'}
                  </span>
                </div>
                <span className="text-[9px] opacity-70 font-medium">حفظ مباشر للجهاز</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Screen Content Wrapper */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {view === 'edit' ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="no-print"
              >
                <QuotationForm quotation={quotation} onUpdate={setQuotation} />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center"
              >
                <QuotationPreview quotation={quotation} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Print Content (Always rendered but moved off-screen for calculation if not in preview) */}
        <div 
          className={view === 'edit' ? 'absolute top-[-9999px] left-[-9999px] w-[210mm]' : ''} 
          style={{ pointerEvents: 'none' }}
        >
          {view === 'edit' && <QuotationPreview quotation={quotation} />}
        </div>
      </main>

      {/* Floating Action Button for mobile */}
      <div className="fixed bottom-6 right-6 no-print md:hidden">
        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform ${
            isGenerating ? 'bg-gray-400' : 'bg-blue-600 text-white'
          }`}
        >
          {isGenerating ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Printer className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
