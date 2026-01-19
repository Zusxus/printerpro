import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../cropUtils';

interface ImageCropperProps {
  imageSrc: string;
  aspectRatio: number;
  onCancel: () => void;
  onCropComplete: (croppedImage: string) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ 
  imageSrc, 
  aspectRatio, 
  onCancel, 
  onCropComplete 
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [mode, setMode] = useState<'standard' | 'advanced'>('standard');
  const [rotation, setRotation] = useState(0);

  const rotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  const rotateLeft = () => {
    setRotation(prev => prev - 90);
  };

  const onCropCompleteHandler = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleReset = () => {
    setRotation(0);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const handleSave = async () => {
    try {
      if (!croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  // دوال التحكم بالزوم بدقة
  const zoomIn = () => setZoom(prev => Math.min(3, +(prev + 0.05).toFixed(2)));
  const zoomOut = () => setZoom(prev => Math.max(0.2, +(prev - 0.05).toFixed(2)));

  return (
    // 🎨 الخلفية الخارجية معتمة أكثر في الوضع الليلي
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-500/30 dark:bg-slate-950/80 backdrop-blur-sm p-4 no-print transition-colors duration-300" dir="rtl">
      
      {/* 🎨 المودال الرئيسي */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl h-[90vh] rounded-[25px] overflow-hidden shadow-2xl flex border border-white/20 dark:border-slate-700 transition-colors">
        
        {/* شريط الأدوات الجانبي */}
        <div className="w-16 bg-slate-50 dark:bg-slate-800 border-l border-slate-100 dark:border-slate-700 flex flex-col items-center py-8 gap-6 transition-colors">

          <button 
              onClick={() => setMode('standard')}
              className={`p-3 rounded-xl transition-all ${mode === 'standard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              title="اداة لقص المستمسك"
          >
            <svg className="scale-150 w-4 h-4 icon icon-tabler icons-tabler-outline icon-tabler-frame" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M4 17l16 0" /><path d="M7 4l0 16" /><path d="M17 4l0 16" />
            </svg>
          </button>

          {/* 🎨 أزرار التدوير: ألوان هوفر متناسقة مع الداكن */}
          <button 
            onClick={rotateRight} 
            className="flex flex-col items-center justify-center p-3 gap-1 text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-500 dark:hover:text-blue-400 rounded-xl transition-all group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.49 12 3.75-3.751m0 0-3.75-3.75m3.75 3.75H3.74V19.5" />
            </svg>
            <span className="text-[10px] font-bold">يمين</span>
          </button>

          <button 
            onClick={rotateLeft} 
            className="flex flex-col items-center justify-center p-3 gap-1 text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-500 dark:hover:text-blue-400 rounded-xl transition-all group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.49 12 3.74 8.248m0 0 3.75-3.75m-3.75 3.75h16.5V19.5" />
            </svg>
            <span className="text-[10px] font-bold">يسار</span>
          </button>

          <button 
            onClick={handleReset}
            className="flex flex-col items-center justify-center p-3 gap-1 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all group"
            title="إعادة ضبط"
          >
            <svg className="w-6 h-6 group-active:rotate-[-180deg] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-[10px] font-bold">إعادة</span>
          </button>
        </div>

        {/* المساحة الرئيسية */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 transition-colors">
          {/* رأس النافذة */}
          <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">تعديل وتركيز المستمسك</h3>
              <p className="text-xs text-slate-400">استخدم الزوم والتحريك لضبط الحواف</p>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* منطقة الكروبّر */}
          {/* 🎨 حدود خفيفة لتفصل الصورة عن الخلفية الداكنة */}
          <div className="relative flex-1 bg-slate-900 m-4 rounded-[20px] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onCropComplete={onCropCompleteHandler}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              objectFit="contain"
              restrictPosition={true}
              minZoom={1}
              maxZoom={4}
            />
          </div>

          {/* شريط التحكم السفلي */}
          <div className="p-8 bg-white dark:bg-slate-800 border-t border-slate-50 dark:border-slate-700 space-y-6 transition-colors">
            
            {/* أزرار السلايدر */}
            <div className="flex items-center justify-center gap-6 max-w-2xl mx-auto">
              <button 
                onClick={zoomOut}
                className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-3xl text-slate-600 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-all shadow-lg dark:shadow-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>
              </button>
              
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={4}
                  step={0.01}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-300 dark:text-slate-500 px-1 uppercase tracking-tighter">
                  <span>تصغير</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>تكبير</span>
                </div>
              </div>

              <button 
                onClick={zoomIn}
                className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-3xl text-slate-600 dark:text-slate-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 hover:border-green-200 dark:hover:border-green-800 transition-all shadow-lg dark:shadow-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>

            {/* أزرار الأكشن */}
            <div className="flex gap-4">
              <button 
                onClick={onCancel} 
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl transition-all"
              >
                إلغاء
              </button>
              <button 
                onClick={handleSave} 
                className="flex-[3] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                اعتماد القص وحفظ المستمسك
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;