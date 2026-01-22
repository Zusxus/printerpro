/** @type {import('tailwindcss').Config} */
export default {
  // تفعيل الوضع الليلي يدوياً عبر الكلاسات
  darkMode: ["class"],
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      
      // 👇 تم تعديل الألوان لتدعم HSL وتتوافق مع الثيمات الجديدة
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: { // هذا هو الاسم القياسي للون الأحمر
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // 👇 إبقاء هذا للتوافق مع كودك القديم (زر الحذف)
        // جعلناه يأخذ نفس لون الـ destructive
        danger: "hsl(var(--destructive))",
      },
    },
  },
  plugins: [],
}