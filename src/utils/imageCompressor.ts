/**
 * Compresses an image file or base64 data URL to a maximum width/height
 * and returns a promise resolving to a compressed Base64 Data URL.
 * If the file is already small enough (< 1.5MB), it keeps the 100% original file
 * as-is without any quality loss or resolution downscaling.
 */
export function compressImage(
  fileOrDataUrl: File | string,
  maxWidth = 1800,
  maxHeight = 1800,
  quality = 0.95
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's a File and under 1.5 MB, read it directly as-is to preserve 100% original quality
    if (fileOrDataUrl instanceof File && fileOrDataUrl.size < 1500000) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(fileOrDataUrl);
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Calculate new dimensions
      let width = img.width;
      let height = img.height;

      // If dimensions are smaller than maxWidth/maxHeight, keep them original
      if (width <= maxWidth && height <= maxHeight) {
        // Just draw original dimensions to canvas for high quality
        maxWidth = width;
        maxHeight = height;
      }

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Create a canvas to draw the resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
        return;
      }

      // Draw and compress with high-quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = (err) => {
      reject(err);
    };

    // Load source
    if (fileOrDataUrl instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(fileOrDataUrl);
    } else {
      img.src = fileOrDataUrl;
    }
  });
}

