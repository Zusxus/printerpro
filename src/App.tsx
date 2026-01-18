import React, { useState, useEffect, useMemo } from 'react';
import { DocType, DocumentState, CalibrationData } from './types';
import { DOCUMENT_CONFIGS, DEFAULT_CALIBRATION, PAGE_MARGIN_MM, SLOT_GAP_MM } from './components/constants';
import Sidebar from './components/Sidebar';
import A4Page from './components/A4Page';
import CalibrationModal from './components/CalibrationModal';
import SettingsPage from './components/SettingsModal';
import ImageCropper from './components/ImageCropper';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'precision_print_calibration_v2';
const SETTINGS_KEY = 'precision_print_settings_v2';

const App: React.FC = () => {
  // ... (كل الكود السابق للحالات والمنطق يبقى كما هو تماماً بدون تغيير) ...
  const [documents, setDocuments] = useState<DocumentState[]>([]);
  const [currentView, setCurrentView] = useState<'editor' | 'settings'>('editor');
  const [isCalibrating, setIsCalibrating] = useState(false); // ✅ هذه الحالة ضرورية هنا
  
  const [cropData, setCropData] = useState<{src: string, docId: string, slot: string, aspect: number} | null>(null);
  const [cropQueue, setCropQueue] = useState<any[]>([]);
  const [deletingPageIdx, setDeletingPageIdx] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [lastDeletedDocs, setLastDeletedDocs] = useState<DocumentState[]>([]);
  const [settings, setSettings] = useState({
    groupOrientation: 'vertical' as 'horizontal' | 'vertical',
    showCutMarks: true,
    showLabels: true,
  });
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [calibration, setCalibration] = useState<CalibrationData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CALIBRATION;
  });

  // ... (منطق حساب الصفحات كما هو) ...
  const pages = useMemo(() => {
     // ... (نفس الكود السابق) ...
     // اختصاراً للكود هنا لأنه لم يتغير
     const pagesResult: { docs: DocumentState[] }[] = [];
     let currentPageDocs: DocumentState[] = [];
     let currentX = PAGE_MARGIN_MM;
     let currentY = PAGE_MARGIN_MM;
     let maxRowHeight = 0;
 
     documents.forEach((doc) => {
       const config = DOCUMENT_CONFIGS[doc.type];
       const isH = settings.groupOrientation === 'horizontal';
       const groupW = isH ? config.widthMm * config.slots.length : config.widthMm;
       const groupH = isH ? config.heightMm : config.heightMm * config.slots.length;
 
       if (currentX + (groupW * calibration.scale) > 210 - PAGE_MARGIN_MM) {
         currentX = PAGE_MARGIN_MM;
         currentY += (maxRowHeight * calibration.scale) + SLOT_GAP_MM;
         maxRowHeight = 0;
       }
 
       if (currentY + (groupH * calibration.scale) > 297 - PAGE_MARGIN_MM) {
         pagesResult.push({ docs: currentPageDocs });
         currentPageDocs = [];
         currentX = PAGE_MARGIN_MM;
         currentY = PAGE_MARGIN_MM;
         maxRowHeight = 0;
       }
 
       currentPageDocs.push(doc);
       currentX += (groupW * calibration.scale) + SLOT_GAP_MM;
       maxRowHeight = Math.max(maxRowHeight, groupH);
     });
 
     if (currentPageDocs.length > 0) pagesResult.push({ docs: currentPageDocs });
     return pagesResult.length > 0 ? pagesResult : [{ docs: [] }];
  }, [documents, settings, calibration.scale]);

  const [activePageIndex, setActivePageIndex] = useState(0);

  // ... (التأثيرات Effects كما هي) ...
  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calibration));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [calibration, settings]);

  useEffect(() => {
    if (pages.length > 0) {
      if (activePageIndex >= pages.length) {
        setActivePageIndex(pages.length - 1);
      }
    }
  }, [pages.length]);

  // ... (الوظائف Functions كما هي) ...
  const handleImageUpload = async (files: File[], docId: string, startSlot: string, type: DocType) => {
    // ... (نفس الكود) ...
    const config = DOCUMENT_CONFIGS[type];
    const aspect = config.widthMm / config.heightMm;
    const startIndex = config.slots.indexOf(startSlot);
    const pendingItems: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const slotIndex = startIndex + i;
      if (slotIndex < config.slots.length) {
        const file = files[i];
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = (e) => {
            pendingItems.push({ src: e.target?.result as string, docId, slot: config.slots[slotIndex], aspect });
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
    }

    if (pendingItems.length > 0) {
      setCropData(pendingItems[0]);
      setCropQueue(pendingItems.slice(1));
    }
  };

  const onUpdateImage = (docId: string, slot: string, data: string | null) => {
    setDocuments(prev => prev.map(d => d.id === docId ? {...d, images: {...d.images, [slot]: data}} : d));
  };

  const addDocument = (type: DocType) => {
     // ... (نفس الكود) ...
     const config = DOCUMENT_CONFIGS[type];
    const newDoc: DocumentState = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      images: config.slots.reduce((acc, slot) => ({ ...acc, [slot]: null }), {}),
      position: { x: 0, y: 0 },
      pageIndex: 0
    };
    setDocuments(prev => [...prev, newDoc]); 
  };

  const handleDeletePage = (pageIndex: number) => {
     // ... (نفس الكود) ...
     setDeletingPageIdx(pageIndex);
    setTimeout(() => {
      const docsToDelete = pages[pageIndex].docs;
      const docsIdsToDelete = docsToDelete.map(d => d.id);
      setLastDeletedDocs(docsToDelete);
      setShowToast(true);
      setDocuments(prev => prev.filter(d => !docsIdsToDelete.includes(d.id)));
      setDeletingPageIdx(null);
      if (activePageIndex >= pages.length - 1 && activePageIndex > 0) {
        setActivePageIndex(prev => prev - 1);
      }
      setTimeout(() => setShowToast(false), 4000);
    }, 500);
  };

  const handleUndo = () => {
    setDocuments(prev => [...prev, ...lastDeletedDocs]);
    setShowToast(false);
  };

  // 1️⃣ أضف هذا المتغير في بداية الـ App function (مع الـ hooks)
// هذه المعادلة تحسب حجم الشاشة وتطرح منها الهوامش لتعطيك الـ Scale المناسب
const [scaleFactor, setScaleFactor] = useState(1);

useEffect(() => {
  const handleResize = () => {
    // ارتفاع ورقة الـ A4 بالبكسل تقريباً هو 1123
    const a4Height = 1123; 
    // ارتفاع الشاشة المتاح (نخصم 10% هوامش علوية وسفلية)
    const availableHeight = window.innerHeight * 0.9; 
    
    // نحسب نسبة التصغير المطلوبة
    const newScale = availableHeight / a4Height;
    
    // نضع حداً أقصى للتكبير (مثلاً لا تزيد عن 1) وحداً أدنى
    setScaleFactor(Math.min(Math.max(newScale, 0.4), 1));
  };

  // شغل الدالة أول مرة وعند تغيير حجم الشاشة
  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  return (
    <div className="min-h-dvh md:h-screen bg-slate-100 dark:bg-slate-900 flex flex-col md:flex-row-reverse overflow-x-hidden md:overflow-hidden font-sans text-right print:ltr print:bg-white print:block print:h-auto print:overflow-visible" dir="rtl">
      
      <aside className="w-full h-dvh md:w-96 md:h-full bg-white dark:bg-slate-800 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 shadow-xl z-20 flex-shrink-0 overflow-y-auto transition-colors print:hidden">
        <Sidebar 
          documents={documents}
          onAdd={addDocument}
          onRemove={(id) => setDocuments(documents.filter(d => d.id !== id))}
          onUpdateImage={onUpdateImage}
          onImageUpload={handleImageUpload}
          onPrint={() => window.print()}
          // ❌ تم حذف onOpenCalibration من هنا لأننا حذفنا الزر من السايدبار
          onOpenSettings={() => setCurrentView('settings')}
        />
      </aside>
      {/*النصف الايمن*/}
        <main className="flex-1 py-[20vh] p-2 md:p-0 bg-slate-200/50 dark:bg-slate-950 grid place-content-center w-full h-full md:overflow-hidden relative transition-colors print:p-0 print:m-0 print:bg-white print:block print:w-full print:h-auto print:overflow-visible">
          {currentView === 'editor' ? (
            <>
              {/*يسنتر المحتوى في الوسط */}
              <div className="
                 w-fit flex flex-col items-center justify-center
                 transition-transform duration-200 ease-out
                 /* في الموبايل نلغي هذا النظام ونرجع للطبيعي */
                 md:w-fit md:h-fit
                 print:scale-100 print:w-full print:h-auto
               "
               style={{ 
                 // هنا السحر: في الشاشات الكبيرة نطبق السكيل المحسوب، وفي الموبايل نلغيه (نخليه 1)
                 transform: window.innerWidth >= 500 ? `scale(${scaleFactor})` : 'none' 
               }}
             >
                {pages.map((page, idx) => {
                  const uniqueKey = page.docs[0]?.id || idx;
                  const isActive = idx === activePageIndex;
                  const isDeleting = idx === deletingPageIdx;

                  return (
                    <div 
                      key={uniqueKey} 
                      className={`
                        relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
    
                         /* تأثير الحذف */
                        ${isDeleting ? 'opacity-0 scale-50 max-h-0 mb-0 overflow-hidden' : 'opacity-100 scale-100 max-h-[1000px]'

                        }
    
                        ${isActive ? 'block' : 'block md:hidden'}
                        mb-0 h-[135mm] xs:h-[165mm] sm:h-[225mm] md:h-auto md:mb-0
                        print:block print:w-full print:h-auto print:static print:max-h-none print:opacity-100 print:scale-100 print:mb-0
                        `}
>
                      {/*كونتينر علمود الانميشن*/}
                      <div className="
                            relative mb-4 md:mb-0 shadow-2xl 
                            scale-[0.45] xs:scale-[0.55] sm:scale-[0.75] md:scale-[0.50] lg:scale-[0.75] xl:scale-[0.85]
                            origin-top md:origin-top 
                            mx-auto
                            w-[210mm] left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0
                            print:shadow-none print:mb-0 print:scale-100 print:w-full print:mx-0 print:origin-top-left print:left-0
                            print:break-after-page print:static print:translate-x-0 print:left-auto
                      ">
                        <button
                          onClick={() => handleDeletePage(idx)}
                          className="absolute -top-3 -right-3 z-50 bg-rose-500 text-white p-2 rounded-full shadow-lg hover:bg-rose-600 hover:scale-110 transition-all duration-200 group md:opacity-0 md:hover:opacity-100 print:hidden"
                          title="حذف الورقة بالكامل"
                          style={{ opacity: 1 }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>

                        <A4Page 
                          pageDocs={page.docs} 
                          allDocs={documents} 
                          onSwap={(f, t) => {
                            const next = [...documents];
                            const [moved] = next.splice(f, 1);
                            next.splice(t, 0, moved);
                            setDocuments(next);
                          }}
                          settings={settings}
                          onImageUpload={handleImageUpload}
                          calibrationScale={calibration.scale}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {pages.length > 1 && (
                <div className="hidden md:flex absolute bottom-3 left-1/2 -translate-x-1/2 z-50 items-center gap-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 transition-all animate-in slide-in-from-bottom-4 print:hidden">
                  <button 
                    onClick={() => setActivePageIndex(p => Math.min(pages.length - 1, p + 1))}
                    disabled={activePageIndex === pages.length - 1}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-slate-700 dark:text-slate-200"
                  >
                    <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="flex flex-col items-center px-2">
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                      {activePageIndex + 1} / {pages.length}
                    </span>
                  </div>
                  <button 
                    onClick={() => setActivePageIndex(p => Math.max(0, p - 1))}
                    disabled={activePageIndex === 0}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-slate-700 dark:text-slate-200"
                  >
                    <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
              
              <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-4 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl transition-all duration-500 print:hidden ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                <span className="text-sm font-medium">تم حذف الورقة</span>
                <button onClick={handleUndo} className="text-yellow-400 text-sm font-bold hover:underline">
                  تراجع
                </button>
                <button onClick={() => setShowToast(false)} className="text-slate-500 hover:text-white">✕</button>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-white dark:bg-slate-800 p-6 md:p-10 shadow-xl overflow-y-auto transition-colors print:hidden">
              {/* ✅✅✅ هنا الإضافة المهمة: تمرير فنكشن فتح المعايرة ✅✅✅ */}
              <SettingsPage 
                settings={settings} 
                onUpdate={setSettings} 
                onBack={() => setCurrentView('editor')} 
                isDarkMode={isDarkMode}
                onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                onOpenCalibration={() => setIsCalibrating(true)} 
              />
            </div>
          )}
        </main>

      {/* باقي الكود (المودالات) كما هو */}
      {cropData && (
        <div className="fixed inset-0 z-[100] bg-black md:bg-black/80 flex items-center justify-center print:hidden">
          <div className="w-full h-full md:w-auto md:h-auto max-w-4xl bg-white md:rounded-2xl overflow-hidden shadow-2xl">
            <ImageCropper 
              imageSrc={cropData.src}
              aspectRatio={cropData.aspect}
              onCancel={() => { setCropData(null); setCropQueue([]); }}
              onCropComplete={(img) => {
                onUpdateImage(cropData.docId, cropData.slot, img);
                if (cropQueue.length > 0) {
                  const next = cropQueue[0];
                  setCropQueue(prev => prev.slice(1));
                  setCropData(next);
                } else {
                  setCropData(null);
                }
              }}
            />
          </div>
        </div>
      )}

      {isCalibrating && (
        <CalibrationModal 
          onSave={(mW, mH) => { setCalibration({ scale: (100/mW + 50/mH)/2, lastMeasuredWidth: mW, lastMeasuredHeight: mH }); setIsCalibrating(false); }}
          onClose={() => setIsCalibrating(false)}
          currentMeasuredWidth={calibration.lastMeasuredWidth}
          currentMeasuredHeight={calibration.lastMeasuredHeight}
          calibrationScale={calibration.scale}
        />
      )}
    </div>
  );
};

export default App;