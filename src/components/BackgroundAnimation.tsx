import React from 'react';

interface BackgroundAnimationProps {
  theme: string;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ theme }) => {
  
  // 🎨 تحديد الألوان لكل ثيم
  const getThemeColors = () => {
    switch (theme) {
      case 'fire':
        return {
          blob1: 'bg-orange-500',
          blob2: 'bg-red-600',
          blob3: 'bg-yellow-500',
          opacity: 'opacity-40' // النار تحتاج وضوح أكثر
        };
      case 'glass':
        return {
          blob1: 'bg-cyan-400',
          blob2: 'bg-blue-600',
          blob3: 'bg-violet-500',
          opacity: 'opacity-40'
        };
      case 'dark':
        return {
          blob1: 'bg-slate-800',
          blob2: 'bg-blue-900',
          blob3: 'bg-indigo-950',
          opacity: 'opacity-50' // غامق وهادئ
        };
      default: // light
        return {
          blob1: 'bg-blue-200',
          blob2: 'bg-purple-200',
          blob3: 'bg-pink-200',
          opacity: 'opacity-60'
        };
    }
  };

  const colors = getThemeColors();

  return (
    // حاوية الخلفية: مثبتة في الخلف تماماً ولا تعيق الضغط
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-50 pointer-events-none transition-colors duration-700">
      
      {/* 🟢 الكرة الأولى */}
      <div className={`absolute top-0 -left-4 w-96 h-96 ${colors.blob1} rounded-full mix-blend-multiply filter blur-[80px] ${colors.opacity} animate-blob transition-colors duration-1000`}></div>
      
      {/* 🟣 الكرة الثانية */}
      <div className={`absolute top-0 -right-4 w-96 h-96 ${colors.blob2} rounded-full mix-blend-multiply filter blur-[80px] ${colors.opacity} animate-blob animation-delay-2000 transition-colors duration-1000`}></div>
      
      {/* 🟡 الكرة الثالثة */}
      <div className={`absolute -bottom-32 left-20 w-96 h-96 ${colors.blob3} rounded-full mix-blend-multiply filter blur-[80px] ${colors.opacity} animate-blob animation-delay-4000 transition-colors duration-1000`}></div>
      
      {/* طبقة إضافية للوضع الليلي لجعله أكثر عمقاً */}
      {theme === 'dark' && <div className="absolute inset-0 bg-slate-950/80"></div>}
    </div>
  );
};

export default BackgroundAnimation;