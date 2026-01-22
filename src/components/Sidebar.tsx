import React from 'react';
import { DocType, DocumentState } from '../types';
import { DOCUMENT_CONFIGS } from './constants';
import { Settings} from "lucide-react"; 
// استوردت لك ايقونات شائعة قد تحتاجها
interface SidebarProps {
  documents: DocumentState[];
  onAdd: (type: DocType) => void;
  onRemove: (id: string) => void;
  onUpdateImage: (docId: string, slot: string, data: string | null) => void;
  onImageUpload: (files: File[], docId: string, slot: string, type: DocType) => void;
  onPrint: () => void;
  onOpenCalibration: () => void;
  onOpenSettings: () => void;
}

const handleSavePdf = () => {
  const originalTitle = document.title;
  const date = new Date().toISOString().slice(0, 10);
  document.title = `تصميمي_${date}`;

  window.print();

  setTimeout(() => {
    document.title = originalTitle;
  }, 100);
};

const Sidebar: React.FC<SidebarProps> = ({ 
  documents, onAdd, onRemove, onUpdateImage, onImageUpload, onPrint, onOpenCalibration, onOpenSettings 
}) => {
  return (
    // الخلفية العامة للسايدبار تستخدم bg-card (أو يمكن استخدام bg-background)
    <div className="h-full flex flex-col bg-tr p-4 md:p-6 text-right transition-colors duration-300 print:hidden bg-card text-foreground" dir="rtl">
      
      {/* الرأس - Header: شفافية وتوافق مع الثيم */}
      <div className="mb-6 md:mb-8 flex items-center justify-between sticky top-0 bg-card/10 backdrop-blur-md z-10 pb-2 transition-colors">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-foreground tracking-tighter">برينت برو</h1>
          <p className="text-[9px] md:text-[10px] text-muted-foreground">نظام طباعة المستمسكات</p>
        </div>
        
        {/* زر الإعدادات */}
        {/* زر الإعدادات الجديد - نظيف ومرتب */}
        <button 
          onClick={onOpenSettings} 
          className="p-2 hover:bg-muted rounded-full group transition-colors"
          title="الإعدادات"
        >
          <Settings className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pb-20 md:pb-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full">
        
        {/* قسم إضافة مستمسك جديد */}
        <div>
          <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">إضافة مستمسك</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(DOCUMENT_CONFIGS).filter(([t]) => t !== DocType.CALIBRATION).map(([type, config]) => (
              <button 
                key={type} 
                onClick={() => onAdd(type as DocType)} 
                className="p-3 md:p-3.5 bg-muted/30 border border-border rounded-xl text-[11px] md:text-xs font-bold text-foreground hover:bg-primary/10 hover:border-primary/30 transition-all active:bg-primary/20 flex flex-col items-center gap-1"
              >
                <span className="text-primary text-sm">+</span>
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* قائمة المستمسكات المضافة */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">المستندات الحالية ({documents.length})</h2>
          {documents.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-2xl">
              <p className="text-[10px] text-muted-foreground font-medium">لم يتم إضافة أي مستمسك بعد</p>
            </div>
          )}
          {documents.map((doc) => (
            <div key={doc.id} className="p-3 md:p-4 bg-background/50 border border-border rounded-2xl shadow-sm relative group transition-colors">
              <button 
                onClick={() => onRemove(doc.id)} 
                className="absolute -top-2 -left-2 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-lg active:scale-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="flex justify-between items-center mb-3">
                 <p className="text-[11px] font-black text-foreground">{DOCUMENT_CONFIGS[doc.type].label}</p>
                 <span className="text-[8px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-bold uppercase">{doc.type}</span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {DOCUMENT_CONFIGS[doc.type].slots.map(slot => (
                  <div key={slot} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] text-muted-foreground font-bold tracking-tighter uppercase">{slot}</span>
                    </div>
                    {doc.images[slot] ? (
                      <div className="flex items-center justify-between bg-muted/40 p-2 rounded-xl border border-border">
                        <div className="flex items-center gap-2">
                          <img src={doc.images[slot]!} className="w-10 h-6 object-cover rounded shadow-sm" alt="" />
                          <span className="text-[9px] text-green-600 dark:text-green-400 font-bold">تم الرفع</span>
                        </div>
                        <button 
                          onClick={() => onUpdateImage(doc.id, slot, null)} 
                          className="text-[9px] text-destructive font-bold p-1 hover:bg-destructive/10 rounded transition-colors"
                        >
                          تغيير
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <label className="flex items-center justify-center w-full p-2 border border-dashed border-primary/30 rounded-xl bg-primary/5 cursor-pointer active:bg-primary/10 transition-colors hover:border-primary/60">
                          <span className="text-[9px] text-primary font-bold">اختيار صورة...</span>
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
      <div className="
        fixed bottom-0 left-0 right-0 z-50
        w-full p-4
        bg-card/90
        backdrop-blur-lg
        border-t border-border
        shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]

        md:static
        md:w-full md:p-0
        md:bg-transparent
        md:border-none md:shadow-none
        md:mt-auto md:pt-4
      ">
          <div className="flex gap-3 w-full max-w-md mx-auto md:max-w-none">
            <button 
            onClick={onPrint} 
            disabled={documents.length === 0} 
            className="flex-1 py-3.5 md:py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-xs md:text-sm font-black shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            <span>طباعة</span>
            </button>
            <button 
            onClick={handleSavePdf} 
            disabled={documents.length === 0} 
            className="flex-1 py-3.5 md:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs md:text-sm font-black shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>PDF</span>
            </button>

          </div>
       </div>
    </div>
  );
};

export default Sidebar;