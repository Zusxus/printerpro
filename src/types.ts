export enum DocType {
  NATIONAL_ID = 'NATIONAL_ID',
  FOOD_RATION = 'FOOD_RATION',
  HOUSING_CARD = 'HOUSING_CARD',
  PASSPORT = 'PASSPORT',
  CALIBRATION = 'CALIBRATION'
}

export interface DocDimensions {
  widthMm: number;
  heightMm: number;
  label: string;
  slots: string[]; 
}

export interface DocumentState {
  id: string;
  type: DocType;
  images: Record<string, string | null>;
  // الحقول الجديدة للتحكم بالموقع
  position: { x: number; y: number };
  pageIndex: number;
}

export interface CalibrationData {
  scale: number; 
  lastMeasuredWidth: number;
  lastMeasuredHeight: number;
}

export interface AppSettings {
  groupOrientation: 'horizontal' | 'vertical'; // اتجاه ربط الوجه والظهر
  showCutMarks: boolean;   // إظهار/إخفاء علامات القص
  showLabels: boolean;     // إظهار/إخفاء أسماء المستمسكات
  snapToGrid: boolean;     // تفعيل المغناطيسية (الشبكة)
}

// أضف هذا للـ DocumentState إذا أردت حفظ إعدادات لكل مستمسك على حدة (اختياري)