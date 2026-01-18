import React from 'react';
import { DocType, DocumentState } from '../types';
import { DOCUMENT_CONFIGS } from './constants';

interface SidebarProps {
  documents: DocumentState[];
  onAdd: (type: DocType) => void;
  onRemove: (id: string) => void;
  onUpdateImage: (docId: string, slot: string, data: string | null) => void;
  onImageUpload: (files: File[], docId: string, slot: string, type: DocType) => void;
  onPrint: () => void;
  onOpenCalibration: () => void;
  onOpenSettings: () => void;
  // ❌ حذفنا isDarkMode و onToggleTheme من هنا
}

const Sidebar: React.FC<SidebarProps> = ({ 
  documents, onAdd, onRemove, onUpdateImage, onImageUpload, onPrint, onOpenCalibration, onOpenSettings 
}) => {
  return (
    <div className="h-full flex flex-col p-4 md:p-6 text-right transition-colors duration-300 print:hidden" dir="rtl">
      
      {/* الرأس - Header */}
      <div className="mb-6 md:mb-8 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10 pb-2 transition-colors">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white tracking-tighter">برينت برو</h1>
          <p className="text-[9px] md:text-[10px] text-slate-500 dark:text-slate-400">نظام طباعة المستمسكات</p>
        </div>
        
        {/* زر الإعدادات فقط (بدون زر الشمس/القمر) */}
        <button 
          onClick={onOpenSettings} 
          className="p-2 md:p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-600 transition-all active:scale-95"
        >
          <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pb-20 md:pb-0">
        
        {/* قسم إضافة مستمسك جديد */}
        <div>
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">إضافة مستمسك</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(DOCUMENT_CONFIGS).filter(([t]) => t !== DocType.CALIBRATION).map(([type, config]) => (
              <button 
                key={type} 
                onClick={() => onAdd(type as DocType)} 
                className="p-3 md:p-3.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] md:text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all active:bg-blue-100 flex flex-col items-center gap-1"
              >
                <span className="text-blue-500 text-sm">+</span>
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* قائمة المستمسكات المضافة */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">المستندات الحالية ({documents.length})</h2>
          {documents.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-medium">لم يتم إضافة أي مستمسك بعد</p>
            </div>
          )}
          {documents.map((doc) => (
            <div key={doc.id} className="p-3 md:p-4 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm relative group transition-colors">
              <button 
                onClick={() => onRemove(doc.id)} 
                className="absolute -top-2 -left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="flex justify-between items-center mb-3">
                 <p className="text-[11px] font-black text-slate-800 dark:text-white">{DOCUMENT_CONFIGS[doc.type].label}</p>
                 <span className="text-[8px] bg-slate-100 dark:bg-slate-600 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300 font-bold uppercase">{doc.type}</span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {DOCUMENT_CONFIGS[doc.type].slots.map(slot => (
                  <div key={slot} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] text-slate-400 font-bold tracking-tighter uppercase">{slot}</span>
                    </div>
                    {doc.images[slot] ? (
                      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-600">
                        <div className="flex items-center gap-2">
                          <img src={doc.images[slot]!} className="w-10 h-6 object-cover rounded shadow-sm" alt="" />
                          <span className="text-[9px] text-green-600 dark:text-green-400 font-bold">تم الرفع</span>
                        </div>
                        <button 
                          onClick={() => onUpdateImage(doc.id, slot, null)} 
                          className="text-[9px] text-red-500 font-bold p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          تغيير
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <label className="flex items-center justify-center w-full p-2 border border-dashed border-blue-200 dark:border-slate-600 rounded-xl bg-blue-50/30 dark:bg-slate-800/50 cursor-pointer active:bg-blue-100 dark:active:bg-slate-700 transition-colors">
                          <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold">اختيار صورة...</span>
                          <input 
                            type="file" multiple accept="image/*"
                            onChange={(e) => onImageUpload(Array.from(e.target.files || []), doc.id, slot, doc.type)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* الأزرار الثابتة في الأسفل */}
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2 sticky bottom-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md pb-2 md:pb-0 transition-colors">
        
        <button 
          onClick={onPrint} 
          disabled={documents.length === 0} 
          className="w-full py-3.5 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs md:text-sm font-black shadow-xl shadow-blue-100 dark:shadow-none active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          بدء الطباعة الآن
        </button>
      </div>
    </div>
  );
};

export default Sidebar;