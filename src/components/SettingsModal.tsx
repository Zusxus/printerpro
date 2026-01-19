import React from 'react';

interface SettingsPageProps {
  settings: any;
  onUpdate: (newSettings: any) => void;
  onBack: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenCalibration: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  settings, 
  onUpdate, 
  onBack, 
  isDarkMode, 
  onToggleTheme, 
  onOpenCalibration 
}) => {
  return (
    // ✅ التعديل هنا: تم تغيير z-[100] إلى z-[35]
    // هذا يجعل الإعدادات فوق السايدبار (20) لكن تحت المودالات (50+)
    <div className="fixed inset-0 z-[35] w-full h-dvh md:static md:w-full md:h-full bg-white dark:bg-slate-900 overflow-y-auto animate-in slide-in-from-left duration-300 transition-colors print:hidden
    [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
      
      {/* الهيدر */}
      <header className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4 flex items-center justify-between z-10 transition-colors">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-transparent dark:border-slate-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div>
            <h1 className="text-sm md:text-xl font-black text-slate-800 dark:text-white tracking-tighter">إعدادات النظام</h1>
            <p className="text-sm md:text-l text-slate-400">تخصيص تجربة الطباعة والترتيب الآلي</p>
          </div>
        </div>
        
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm md:text-xl font-bold shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all"
        >
          حفظ والرجوع
        </button>
      </header>

      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="grid gap-10">
          
          {/* قسم تنسيق الصفحة */}
          <section className="space-y-6">
            <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">تنسيق الصفحة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => onUpdate({...settings, groupOrientation: 'vertical'})}
                className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all dark:bg-slate-900 ${settings.groupOrientation === 'vertical' ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
              >
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-4 flex items-center justify-center text-blue-600 border border-slate-100 dark:border-slate-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h8M8 12h8m-8 5h8" /></svg>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm md:text-xl">الربط العمودي</h4>
                <p className="text-sm md:text-l text-slate-500 dark:text-slate-400 mt-1">يتم وضع الوجه والظهر فوق بعضهما (الوضع التقليدي).</p>
              </div>

              <div 
                onClick={() => onUpdate({...settings, groupOrientation: 'horizontal'})}
                className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all dark:bg-slate-900 ${settings.groupOrientation === 'horizontal' ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
              >
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-4 flex items-center justify-center text-blue-600 border border-slate-100 dark:border-slate-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m6 10V7" /></svg>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm md:text-xl">الربط الأفقي</h4>
                <p className="text-sm md:text-l text-slate-500 dark:text-slate-400 mt-1">يتم وضع الوجه والظهر جنباً إلى جنب (مثالي للبطاقات الوطنية).</p>
              </div>
            </div>
          </section>

          {/* قسم المساعدات البصرية */}
          <section className="space-y-4">
            <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">المساعدات البصرية</h3>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-4 border border-slate-100 dark:border-slate-800">
              <div className="divide-y divide-slate-200/50 dark:divide-slate-800">
                <div className="py-5 px-4 flex items-center justify-between">
                  <div>
                    <span className="block font-bold text-slate-700 dark:text-slate-200 text-sm md:text=xl">علامات القص (Cut Marks)</span>
                    <span className="text-sm md:text-l text-slate-400">إضافة خطوط رفيعة حول كل خانة لتسهيل عملية التقطيع بالمقص.</span>
                  </div>
                  <div 
                    onClick={() => onUpdate({...settings, showCutMarks: !settings.showCutMarks})}
                    className={`w-14 h-8 rounded-full relative transition-all cursor-pointer ${settings.showCutMarks ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.showCutMarks ? 'left-1' : 'left-7'}`} />
                  </div>
                </div>

                <div className="py-5 px-4 flex items-center justify-between">
                  <div>
                    <span className="block font-bold text-slate-700 dark:text-slate-200 text-sm md:text-xl">تسمية الخانات الفارغة</span>
                    <span className="text-sm text-slate-400">إظهار نوع المستمسك واسم السلوت (وجه/ظهر) إذا لم يتم رفع صورة.</span>
                  </div>
                  <div 
                    onClick={() => onUpdate({...settings, showLabels: !settings.showLabels})}
                    className={`w-14 h-8 rounded-full relative transition-all cursor-pointer ${settings.showLabels ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.showLabels ? 'left-1' : 'left-7'}`} />
                  </div>
                </div>
              </div>
            </div>
          </section>

           {/* قسم دقة الطباعة والمعايرة */}
           <section className="space-y-4">
            <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">دقة الطباعة</h3>
            <div 
              onClick={onOpenCalibration}
              className="group bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm flex items-center justify-center text-blue-600 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm md:text-xl">معايرة المسطرة</h4>
                    <p className="text-sm md:text-l text-slate-500 dark:text-slate-400 mt-1">اضبط هذا الخيار إذا كانت القياسات المطبوعة أكبر أو أصغر من الواقع.</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-   flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-all">
                   <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>
          </section>

          {/* قسم المظهر والسمات */}
          <section className="space-y-4">
            <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">المظهر والسمات</h3>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-4 border border-slate-100 dark:border-slate-800">
              <div className="divide-y divide-slate-200/50 dark:divide-slate-800">
                <div className="py-5 px-4 flex items-center justify-between">
                  <div>
                    <span className="block font-bold text-slate-700 dark:text-slate-200 text-sm md:text-xl">الوضع الليلي (Dark Mode)</span>
                    <span className="text-sm md:text-l text-slate-400">تحويل واجهة النظام إلى اللون الداكن لراحة العين.</span>
                  </div>
                  
                  <div 
                    onClick={onToggleTheme}
                    className={`w-14 h-8 rounded-full relative transition-all cursor-pointer ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm flex items-center justify-center ${isDarkMode ? 'left-1' : 'left-7'}`}>
                       <span className="text-[10px] select-none">{isDarkMode ? '🌙' : '☀️'}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <footer className="mt-8 p-8 bg-blue-50 dark:bg-slate-900 rounded-[2rem] text-center border border-blue-100 dark:border-slate-800">
            <p className="text-[11px] text-blue-400 dark:text-blue-500/70 font-medium">Precision Print v2.0 • جميع القياسات تعتمد على معايير الطباعة العالمية ISO/IEC 7810</p>
          </footer>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;