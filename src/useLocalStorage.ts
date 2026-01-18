import { useState } from "react";

// هذه الدالة تقبل "مفتاح" (اسم الذاكرة) و "قيمة افتراضية"
export function useLocalStorage<T>(key: string, initialValue: T) {
  
  // 1. أول ما يشتغل الموقع، نحاول نقرأ من الذاكرة القديمة
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // نبحث في متصفح المستخدم عن هذا المفتاح
      const item = window.localStorage.getItem(key);
      // اذا لقى شي يرجعه، واذا ما لقى يرجع القيمة الافتراضية اللي انت حددتها
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // لو صار أي خطأ (مثلا الذاكرة ممتلئة)، نرجع للقيمة الافتراضية
      console.log(error);
      return initialValue;
    }
  });

  // 2. دالة التحديث: هذي اللي راح نستخدمها بدل setMyState العادية
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // السماح بأن تكون القيمة دالة (مثل طريقة React العادية)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // نحفظ القيمة في واجهة الموقع (عشان يتحدث فوراً)
      setStoredValue(valueToStore);
      
      // ونحفظ نسخة منها في متصفح المستخدم (عشان تبقى بعد الريفريش)
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  // نرجع القيمة ودالة التعديل، تماماً مثل useState
  return [storedValue, setValue] as const;
}