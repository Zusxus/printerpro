import React, { useState } from 'react';

interface CalibrationModalProps {
  onSave: (measuredWidth: number, measuredHeight: number) => void;
  onClose: () => void;
  currentMeasuredWidth: number;
  currentMeasuredHeight: number;
  calibrationScale: number;
}

const CalibrationModal: React.FC<CalibrationModalProps> = ({ 
  onSave, onClose, currentMeasuredWidth, currentMeasuredHeight, calibrationScale 
}) => {
  const [measuredWidth, setMeasuredWidth] = useState<string>(currentMeasuredWidth.toString());
  const [measuredHeight, setMeasuredHeight] = useState<string>(currentMeasuredHeight.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(measuredWidth);
    const h = parseFloat(measuredHeight);
    if (!isNaN(w) && w > 0 && !isNaN(h) && h > 0) {
      onSave(w, h);
    }
  };

  return (
    <>
      {/* واجهة المودال - الخلفية المعتمة */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-200/50 dark:bg-slate-950/80 backdrop-blur-sm p-4 no-print text-right transition-colors" dir="rtl">
        
        {/* جسم المودال */}
        <div className="bg-white/90 dark:bg-slate-900/95 w-full max-w-sm rounded-[30px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20 dark:border-slate-700">
          
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">معايرة دقة الطباعة</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">اضبط القياسات لضمان طباعة 1:1 حقيقية</p>
          </div>

          <div className="p-8 space-y-6">
            <button 
              onClick={() => window.print()} 
              className="w-full py-4 bg-white dark:bg-slate-800 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-2xl font-bold hover:bg-blue-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3"
            >
              <span>🖨️</span> طباعة ورقة المعايرة
            </button>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mr-1 uppercase tracking-tighter">العرض المقاس (mm)</label>
                  <input 
                    type="number" step="0.1" 
                    value={measuredWidth} 
                    onChange={(e) => setMeasuredWidth(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-3 px-4 text-2xl font-black text-blue-600 dark:text-blue-400 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all text-center" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mr-1 uppercase tracking-tighter">الطول المقاس (mm)</label>
                  <input 
                    type="number" step="0.1" 
                    value={measuredHeight} 
                    onChange={(e) => setMeasuredHeight(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-3 px-4 text-2xl font-black text-blue-600 dark:text-blue-400 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all text-center" 
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">تجاهل</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 active:scale-[0.98] transition-all">حفظ واعتماد الدقة</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ورقة المعايرة - تظهر فقط في الطباعة (تبقى بيضاء دائماً) */}
      <div className="hidden print:block fixed inset-0 bg-white z-[9999]">
        <div className="flex flex-col items-center justify-start pt-[40mm]">
          <div style={{ width: '100mm', height: '50mm', border: '0.2mm solid #000', boxSizing: 'border-box' }} className="flex items-center justify-center relative bg-white">
             <div className="text-center">
              <p className="text-[14pt] font-bold text-black">مستطيل المعايرة</p>
              <p className="text-[10pt] text-black/60">يجب أن يكون: 100mm × 50mm</p>
            </div>
          </div>
          <p className="mt-12 text-center text-sm text-slate-600 max-w-[120mm]">
            قس هذا المستطيل بالمسطرة وادخل القيم في الموقع للحصول على دقة 1:1.
          </p>
        </div>
      </div>
    </>
  );
};

export default CalibrationModal;