export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation: number = 0 // ضفنا الدوران هنا
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // 1. حساب زاوية الدوران بالراديان
  const rotRad = (rotation * Math.PI) / 180;

  // 2. حساب حجم الحاوية اللي تحتضن الصورة بعد التدوير (Bounding Box)
  const bBoxWidth = Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height);
  const bBoxHeight = Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height);

  // تعيين حجم الكانفاس المؤقت
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // 3. تدوير الكانفاس حول المركز ورسم الصورة
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  // 4. استخراج الصورة المقصوصة من الكانفاس المدور
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  // 5. إعادة تعيين حجم الكانفاس للحجم المقصوص النهائي
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  return canvas.toDataURL('image/jpeg');
}

export const getSmartDefaultCrop = (imageWidth: number, imageHeight: number, aspect: number) => {
  let width = imageWidth;
  let height = imageWidth / aspect;

  if (height > imageHeight) {
    height = imageHeight;
    width = imageHeight * aspect;
  }

  const x = (imageWidth - width) / 2;
  const y = (imageHeight - height) / 2;

  return { x, y, width, height };
};