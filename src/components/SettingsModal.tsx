import React from 'react';
import { useTheme } from './theme-provider'; // 👈 1. استدعاء الهوك
import { 
  X, 
  ChevronRight, // بديل زر الرجوع
  LayoutTemplate, 
  StretchHorizontal, 
  Scissors, 
  Tag, 
  Ruler, 
  Sun, 
  Moon, 
  Flame, 
  Droplets, 
  Check 
} from 'lucide-react'; // 👈 استيراد الأيقونات النظيفة

interface SettingsPageProps {
  settings: any;
  onUpdate: (newSettings: any) => void;
  onBack: () => void;
  // ❌ تم حذف currentTheme و onThemeChange لأننا نستخدم الهوك الآن
  onOpenCalibration: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  settings, 
  onUpdate, 
  onBack, 
  onOpenCalibration 
}) => {
  
  // 👈 2. استخدام الهوك للحصول على الثيم ودالة التغيير
  const { theme: currentTheme, setTheme } = useTheme();

  // تعريف قائمة الثيمات (تأكدنا من تطابق الـ id مع theme-provider)
  const themes = [
    { 
      id: 'light', 
      name: 'الوضع النهاري', 
      icon: <Sun className="w-6 h-6" />, 
      desc: 'مشرق وواضح', 
      previewClass: 'bg-slate-100 border-slate-300' 
    },
    { 
      id: 'dark', 
      name: 'الوضع الليلي', 
      icon: <Moon className="w-6 h-6" />, 
      desc: 'مريح للعين', 
      previewClass: 'bg-slate-900 border-slate-700' 
    },
    { 
      id: 'theme-fire', // ✅ تم التصحيح ليتطابق مع الـ CSS
      name: 'الوضع الناري', 
      icon: <Flame className="w-6 h-6" />, 
      desc: 'طاقة وحيوية', 
      previewClass: 'bg-orange-950 border-orange-800' 
    },
    { 
      id: 'theme-glass', // ✅ تم التصحيح
      name: 'الوضع الزجاجي', 
      icon: <Droplets className="w-6 h-6" />, 
      desc: 'شفافية عصرية', 
      previewClass: 'bg-gradient-to-br from-cyan-500 to-blue-600 border-white/20' 
    },
  ];

  return (
    <div className="fixed inset-0 z-[35] w-full h-dvh md:static md:w-full md:h-full bg-card text-foreground overflow-y-auto animate-in slide-in-from-left duration-300 transition-colors print:hidden
    [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
      
      {/* الهيدر */}
      <header className="sticky top-0 bg-card/80 backdrop-blur-md border-b border-border px-4 py-4 flex items-center justify-between z-10 transition-colors">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-12 h-12 flex items-center justify-center bg-muted/20 text-muted-foreground rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all shadow-sm border border-transparent"
          >
            {/* استبدال SVG بـ Lucide Icon */}
            <ChevronRight className="w-6 h-6 rotate-180 md:rotate-0" /> 
          </button>
          <div>
            <h1 className="text-sm md:text-xl font-black text-foreground tracking-tighter">إعدادات النظام</h1>
            <p className="text-sm md:text-l text-muted">تخصيص تجربة الطباعة والترتيب الآلي</p>
          </div>
        </div>
        
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl text-sm md:text-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/80 transition-all"
        >
          حفظ والرجوع
        </button>
      </header>

      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="grid gap-10">
          
          {/* قسم تنسيق الصفحة */}
          <section className="space-y-6">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest">تنسيق الصفحة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => onUpdate({...settings, groupOrientation: 'vertical'})}
                className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all bg-card ${settings.groupOrientation === 'vertical' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/35 hover:bg-primary/4'}`}
              >
                <div className="w-12 h-12 bg-muted/10 rounded-xl shadow-sm mb-4 flex items-center justify-center text-primary border border-border ">
                   <LayoutTemplate className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-foreground text-sm md:text-xl">الربط العمودي</h4>
                <p className="text-sm md:text-l text-muted mt-1">يتم وضع الوجه والظهر فوق بعضهما (الوضع التقليدي).</p>
              </div>

              <div 
                onClick={() => onUpdate({...settings, groupOrientation: 'horizontal'})}
                className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all bg-card ${settings.groupOrientation === 'horizontal' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/35 hover:bg-primary/4'}`}
              >
                <div className="w-12 h-12 bg-muted/10 rounded-xl shadow-sm mb-4 flex items-center justify-center text-primary border border-border">
                  <StretchHorizontal className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-foreground text-sm md:text-xl">الربط الأفقي</h4>
                <p className="text-sm md:text-l text-muted mt-1">يتم وضع الوجه والظهر جنباً إلى جنب (مثالي للبطاقات الوطنية).</p>
              </div>
            </div>
          </section>

          {/* قسم المساعدات البصرية */}
          <section className="space-y-4">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest">المساعدات البصرية</h3>
            <div className="bg-card rounded-[2.5rem] p-4 border border-border shadow-sm hover:border-primary/50 hover:bg-primary/5">
              <div className="divide-y divide-border">
                <div className="py-5 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Scissors className="w-5 h-5 text-muted-foreground" />
                    <div>
                        <span className="block font-bold text-foreground text-sm md:text=xl ">علامات القص (Cut Marks)</span>
                        <span className="text-sm md:text-l text-muted">إضافة خطوط رفيعة حول كل خانة لتسهيل عملية التقطيع.</span>
                    </div>
                  </div>
                  <div 
                    onClick={() => onUpdate({...settings, showCutMarks: !settings.showCutMarks})}
                    className={`w-14 h-8 rounded-full relative transition-all cursor-pointer ${settings.showCutMarks ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.showCutMarks ? 'left-1' : 'left-7'}`} />
                  </div>
                </div>

                <div className="py-5 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-muted-foreground" />
                    <div>
                        <span className="block font-bold text-foreground text-sm md:text-xl">تسمية الخانات الفارغة</span>
                        <span className="text-sm text-muted">إظهار نوع المستمسك واسم السلوت (وجه/ظهر) إذا لم يتم رفع صورة.</span>
                    </div>
                  </div>
                  <div 
                    onClick={() => onUpdate({...settings, showLabels: !settings.showLabels})}
                    className={`w-14 h-8 rounded-full relative transition-all cursor-pointer ${settings.showLabels ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.showLabels ? 'left-1' : 'left-7'}`} />
                  </div>
                </div>
              </div>
            </div>
          </section>

           {/* قسم دقة الطباعة والمعايرة */}
           <section className="space-y-4">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest">دقة الطباعة</h3>
            <div 
              onClick={onOpenCalibration}
              className="group bg-card rounded-[2.5rem] p-6 border border-border cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted/10 border border-border rounded-2xl shadow-sm flex items-center justify-center text-primary transition-transform">
                    <Ruler className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm md:text-xl">معايرة المسطرة</h4>
                    <p className="text-sm md:text-l text-muted mt-1">اضبط هذا الخيار إذا كانت القياسات المطبوعة أكبر أو أصغر من الواقع.</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center text-muted group-hover:text-primary transition-all">
                   <ChevronRight className="w-5 h-5 rotate-180" />
                </div>
              </div>
            </div>
          </section>

          {/* 👇 قسم المظهر والسمات (يعمل الآن مع theme-provider) */}
          <section className="space-y-4">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest">المظهر والسمات</h3>
            <div className="grid grid-cols-2 gap-4">
              {themes.map((t) => (
                <button 
                  key={t.id}
                  onClick={() => setTheme(t.id as any)} // 👈 استدعاء الدالة هنا
                  className={`
                    relative p-4 rounded-3xl border-2 cursor-pointer transition-all duration-300 overflow-hidden text-right
                    ${currentTheme === t.id 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20 scale-[1.02]' 
                      : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl text-foreground">{t.icon}</span>
                    <div className={`w-6 h-6 rounded-full border shadow-sm ${t.previewClass}`}></div>
                  </div>
                  
                  <h4 className={`font-bold text-lg ${currentTheme === t.id ? 'text-primary' : 'text-foreground'}`}>
                    {t.name}
                  </h4>
                  <p className="text-xs text-muted mt-1 font-medium">{t.desc}</p>
                  
                  {currentTheme === t.id && (
                    <div className="absolute top-4 left-4 text-primary animate-in zoom-in">
                      <Check className="w-6 h-6" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          <footer className="mt-8 p-8 bg-card rounded-[2rem] text-center border border-border shadow-sm">
            <p className="text-[11px] text-muted font-medium">Precision Print v2.0 • جميع القياسات تعتمد على معايير الطباعة العالمية ISO/IEC 7810</p>
          </footer>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;