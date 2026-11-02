/**
 * High-performance client-side image compression and resizing utility.
 * Optimizes phone photos and screenshots before cloud upload or Firestore fallback storage.
 */

export interface CompressedImageResult {
  file: File;
  dataUrl: string;
  originalSizeKb: number;
  compressedSizeKb: number;
}

export async function compressImage(
  file: File,
  maxDimension = 1280,
  quality = 0.85
): Promise<CompressedImageResult> {
  const originalSizeKb = Math.round(file.size / 1024);

  return new Promise((resolve) => {
    // If not an image or SVG, return as-is
    if (!file.type.startsWith('image/') || file.type.includes('svg')) {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          file,
          dataUrl: (reader.result as string) || '',
          originalSizeKb,
          compressedSizeKb: originalSizeKb
        });
      };
      reader.onerror = () => {
        resolve({
          file,
          dataUrl: '',
          originalSizeKb,
          compressedSizeKb: originalSizeKb
        });
      };
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const fallbackDataUrl = (e.target?.result as string) || '';
          resolve({
            file,
            dataUrl: fallbackDataUrl,
            originalSizeKb,
            compressedSizeKb: originalSizeKb
          });
          return;
        }

        // Draw image cleanly
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              const fallbackDataUrl = canvas.toDataURL(mimeType, quality);
              resolve({
                file,
                dataUrl: fallbackDataUrl,
                originalSizeKb,
                compressedSizeKb: originalSizeKb
              });
              return;
            }

            const cleanFileName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
            const compressedFile = new File([blob], cleanFileName, {
              type: mimeType,
              lastModified: Date.now()
            });

            const compressedSizeKb = Math.round(blob.size / 1024);
            const dataUrl = canvas.toDataURL(mimeType, quality);

            resolve({
              file: compressedFile,
              dataUrl,
              originalSizeKb,
              compressedSizeKb
            });
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        const fallbackDataUrl = (e.target?.result as string) || '';
        resolve({
          file,
          dataUrl: fallbackDataUrl,
          originalSizeKb,
          compressedSizeKb: originalSizeKb
        });
      };

      img.src = (e.target?.result as string) || '';
    };

    reader.onerror = () => {
      resolve({
        file,
        dataUrl: '',
        originalSizeKb,
        compressedSizeKb: originalSizeKb
      });
    };

    reader.readAsDataURL(file);
  });
}
