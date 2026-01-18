import React from 'react';
import { DocumentState, DocType } from '../types';
import { DOCUMENT_CONFIGS, PAGE_MARGIN_MM, SLOT_GAP_MM } from './constants';

interface A4PageProps {
  pageDocs: DocumentState[];
  allDocs: DocumentState[];
  onSwap: (f: number, t: number) => void;
  settings: any;
  onImageUpload: (files: File[], docId: string, slot: string, type: DocType) => void;
  calibrationScale: number;
}

const A4Page: React.FC<A4PageProps> = ({ 
  pageDocs, allDocs, onSwap, settings, onImageUpload, calibrationScale 
}) => {
  return (
    <div 
      // الـ classes هنا تضمن بقاء الورقة بيضاء ونظيفة حتى بالموبايل
      className="bg-white relative overflow-hidden print:shadow-none flex flex-wrap content-start shadow-sm"
      style={{ 
        width: '210mm', 
        height: '297mm', 
        padding: `${PAGE_MARGIN_MM}mm`,
        gap: `${SLOT_GAP_MM}mm`,
        // هذا السطر يضمن إن المتصفح يعامل الورقة كـ A4 حقيقية عند الطباعة
        printColorAdjust: 'exact'
      }}
    >
      {pageDocs.map((doc) => {
        const config = DOCUMENT_CONFIGS[doc.type as DocType];
        
        // تطبيق المعايرة (ضرب القياس الأصلي في معامل التصحيح)
        const calWidth = config.widthMm * calibrationScale;
        const calHeight = config.heightMm * calibrationScale;

        return (
          <div 
            key={doc.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('docId', doc.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const fromId = e.dataTransfer.getData('docId');
              const fromIdx = allDocs.findIndex(d => d.id === fromId);
              const toIdx = allDocs.findIndex(d => d.id === doc.id);
              if (fromIdx !== -1) onSwap(fromIdx, toIdx);
            }}
            // الحاوية الخارجية للمستمسك (مثل الوجه والظهر سوية)
            className={`flex ${settings.groupOrientation === 'horizontal' ? 'flex-row' : 'flex-col'} bg-slate-50/50 border border-transparent hover:border-blue-400/30 transition-all rounded-sm`}
            style={{ gap: '0.2mm' }}
          >
            {config.slots.map((slotName) => (
              <div 
                key={slotName}
                onClick={() => {
                  // إذا كانت الخانة فارغة، نفتح اختيار الصور
                  if (!doc.images[slotName]) {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.multiple = true;
                    input.onchange = (e: any) => {
                      const files = Array.from(e.target.files || []) as File[];
                      onImageUpload(files, doc.id, slotName, doc.type as DocType);
                    };
                    input.click();
                  }
                }}
                className="relative cursor-pointer bg-white border border-slate-200 flex items-center justify-center group overflow-hidden"
                style={{ 
                  width: `${calWidth}mm`, 
                  height: `${calHeight}mm` 
                }}
              >
                {/* عرض الصورة إذا وجدت */}
                {doc.images[slotName] ? (
                  <img 
                    src={doc.images[slotName]!} 
                    className="w-full h-full object-cover block shadow-inner" 
                    alt={slotName} 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mb-1 group-hover:bg-blue-100 transition-colors">
                      <span className="text-blue-500 text-xs font-bold">+</span>
                    </div>
                    {settings.showLabels && (
                      <span className="text-[6px] md:text-[7px] text-slate-400 font-bold uppercase tracking-tighter leading-tight">
                        {slotName}
                      </span>
                    )}
                  </div>
                )}
                
                {/* علامات القص (تظهر فقط إذا تم تفعيلها من الإعدادات) */}
                {settings.showCutMarks && (
                  <div className="absolute inset-0 pointer-events-none border-[0.05mm] border-black/10" />
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default A4Page;