import { DocType, DocDimensions, CalibrationData } from '../types';

export const DOCUMENT_CONFIGS: Record<DocType, DocDimensions> = {
  [DocType.NATIONAL_ID]: {
    widthMm: 85.60,
    heightMm: 54.00,
    label: 'البطاقة الوطنية',
    slots: ['الوجه الأمامي', 'الوجه الخلفي']
  },
  [DocType.FOOD_RATION]: {
    widthMm: 70,
    heightMm: 160,
    label: 'بطاقة التموينية',
    slots: ['الوجه الأمامي']
  },
  [DocType.HOUSING_CARD]: {
    widthMm: 105,
    heightMm: 74,
    label: 'بطاقة السكن',
    slots: ['الوجه الأمامي']
  },
  [DocType.PASSPORT]: {
    widthMm: 125,
    heightMm: 88,
    label: 'الجواز',
    slots: ['الصفحة الرئيسية']
  },
  [DocType.CALIBRATION]: {
    widthMm: 100,
    heightMm: 50,
    label: 'أداة المعايرة',
    slots: []
  }
};

export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const PAGE_MARGIN_MM = 10;
export const SLOT_GAP_MM = 5;

export const DEFAULT_CALIBRATION: CalibrationData = {
  scale: 1.0,
  lastMeasuredWidth: 100,
  lastMeasuredHeight: 50 // القيمة الافتراضية للطول المضاف
};