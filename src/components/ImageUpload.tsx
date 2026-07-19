import React, { useRef, useState } from 'react';
import { Upload, Link, AlertCircle, RefreshCw, Check } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  aspectRatio?: 'circle' | 'square' | 'wide';
}

export default function ImageUpload({
  value,
  onChange,
  label,
  className = '',
  aspectRatio = 'circle',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    setIsCompressing(true);
    setError(null);

    try {
      // Compress the image before saving to base64 - HD Quality parameters (keeps 100% original if size is small)
      const compressedBase64 = await compressImage(file, 1920, 1920, 0.96);
      onChange(compressedBase64);
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to process image. Try a different one.');
    } finally {
      setIsCompressing(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'circle':
        return 'w-16 h-16 rounded-full';
      case 'square':
        return 'w-16 h-16 rounded-xl';
      case 'wide':
        return 'w-24 h-14 rounded-lg';
      default:
        return 'w-16 h-16 rounded-full';
    }
  };

  return (
    <div className={`space-y-2 bg-neutral-950/40 p-3 border border-neutral-900 rounded-xl ${className}`}>
      {label && (
        <span className="block text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
          {label}
        </span>
      )}

      <div className="flex items-center gap-3">
        {/* Preview */}
        <div className={`${getAspectClass()} overflow-hidden border border-neutral-800 bg-neutral-900 flex-shrink-0 relative`}>
          <img
            src={value || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&auto=format&fit=crop'}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&auto=format&fit=crop';
            }}
            referrerPolicy="no-referrer"
          />
          {isCompressing && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-rose-500 animate-spin" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={triggerFileSelect}
              disabled={isCompressing}
              className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 text-rose-400 border border-rose-500/20 rounded-lg px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Gallery 📱
            </button>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className={`p-1.5 border rounded-lg cursor-pointer transition-all ${
                showUrlInput 
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-400' 
                  : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-white'
              }`}
              title="Use Web Link/URL"
            >
              <Link className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[8px] text-neutral-500 font-mono">
            Directly select from your phone's gallery/camera!
          </p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Optional URL input box */}
      {showUrlInput && (
        <div className="mt-2 space-y-1">
          <input
            type="text"
            value={value.startsWith('data:') ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-black border border-neutral-800 rounded-lg px-2.5 py-1.5 text-[10px] text-neutral-200 focus:outline-none focus:border-rose-500/30 font-mono"
            placeholder="Paste direct .jpg/.png web link"
          />
          <span className="text-[8px] text-neutral-500 block">
            Or paste a Google Drive, Imgur, or direct website URL.
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1 text-[9px] text-red-400 font-mono mt-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
