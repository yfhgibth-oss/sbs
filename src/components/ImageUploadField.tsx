import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Check, 
  Loader2, 
  Smartphone, 
  Monitor, 
  Link as LinkIcon, 
  Sparkles,
  RefreshCw,
  Eye
} from 'lucide-react';
import { uploadImageToStorage } from '../services/firebaseService';
import { compressImage } from '../utils/imageCompressor';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  folder?: string;
  required?: boolean;
  language?: 'bn' | 'en';
  helpText?: string;
  compact?: boolean;
  allowUrlFallback?: boolean;
  demoPresets?: Array<{ label: string; url: string }>;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label,
  placeholder,
  folder = 'uploads',
  required = false,
  language = 'bn',
  helpText,
  compact = false,
  allowUrlFallback = true,
  demoPresets
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBn = language === 'bn';

  const handleFileProcess = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(isBn ? 'দয়া করে একটি সঠিক ইমেজ (JPG, PNG, WEBP) ফাইল নির্বাচন করুন।' : 'Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgressMsg(isBn ? 'ছবি অপ্টিমাইজ ও প্রসেস করা হচ্ছে...' : 'Optimizing and resizing image...');

      // Compress client-side
      const compressed = await compressImage(file, 1400, 0.85);

      setUploadProgressMsg(isBn ? 'ক্লাউডে আপলোড হচ্ছে...' : 'Uploading image to secure storage...');

      // Upload to storage (with fallback to base64 dataUrl inside uploadImageToStorage)
      const uploadedUrl = await uploadImageToStorage(compressed.file, folder);

      // If storage returned a URL, use it; otherwise use the compressed dataUrl
      const finalUrl = uploadedUrl || compressed.dataUrl;

      onChange(finalUrl);
      setUploadProgressMsg('');
    } catch (err) {
      console.error('Image upload failed:', err);
      // Fallback directly to reading file as base64
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            onChange(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      } catch (fallbackErr) {
        console.error('Fallback read failed', fallbackErr);
      }
    } finally {
      setIsUploading(false);
      setUploadProgressMsg('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between text-xs">
        {label && (
          <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{label}</span>
            {required && <span className="text-rose-500 font-bold">*</span>}
          </label>
        )}

        {allowUrlFallback && (
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <LinkIcon className="w-3 h-3" />
            <span>
              {showUrlInput 
                ? (isBn ? '📁 ডিভাইস থেকে আপলোড' : '📁 Upload from Device')
                : (isBn ? '🌐 লিংক দিয়ে ইনপুট' : '🌐 Paste Web Link')}
            </span>
          </button>
        )}
      </div>

      {helpText && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
          {helpText}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* URL Input Mode if selected */}
      {showUrlInput ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || (isBn ? 'https://... ইমেজ লিংক পেস্ট করুন' : 'https://... paste image URL')}
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 transition"
                title={isBn ? 'মুছে ফেলুন' : 'Clear'}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {value && (
            <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-40 bg-slate-950 flex items-center justify-center">
              <img src={value} alt="Preview" className="max-h-40 object-contain" />
              <button
                type="button"
                onClick={() => setPreviewZoom(true)}
                className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition text-xs flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isBn ? 'বড় করে দেখুন' : 'Preview'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Direct Device Upload Dropzone */
        <div className="space-y-2">
          {value ? (
            /* Uploaded Preview State */
            <div className="relative rounded-2xl border-2 border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/20 p-2.5 sm:p-3 transition">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div 
                    onClick={() => setPreviewZoom(true)}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-800 bg-slate-900 shrink-0 cursor-pointer group"
                    title={isBn ? 'বড় করে দেখতে ক্লিক করুন' : 'Click to zoom'}
                  >
                    <img 
                      src={value} 
                      alt="Uploaded Preview" 
                      className="w-full h-full object-cover group-hover:scale-105 transition" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="p-0.5 rounded-full bg-emerald-500 text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        {isBn ? 'ছবি প্রস্তুত আছে' : 'Image Uploaded & Ready'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {isBn ? 'ফোন/কম্পিউটার থেকে সফলভাবে লোড হয়েছে' : 'Loaded directly from device'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    <RefreshCw className="w-3 h-3 text-indigo-500" />
                    <span>{isBn ? 'বদলান' : 'Change'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={isUploading}
                    className="p-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition"
                    title={isBn ? 'মুছে ফেলুন' : 'Remove'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Dropzone (Empty State) */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed p-4 sm:p-6 text-center cursor-pointer transition select-none ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 scale-[0.99]'
                  : isUploading
                  ? 'border-amber-400 bg-amber-50/30 dark:bg-amber-950/20 cursor-wait'
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 bg-slate-50/50 dark:bg-slate-900/40'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {uploadProgressMsg || (isBn ? 'ছবি প্রসেস হচ্ছে...' : 'Processing image...')}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {isBn ? 'অনুগ্রহ করে অপেক্ষা করুন' : 'Please wait a moment'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {isBn ? 'ছবি বা স্ক্রিনশট নির্বাচন করতে চাপ দিন' : 'Click or Tap to Upload Screenshot/Photo'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {isBn 
                        ? 'কম্পিউটার বা ফোনের গ্যালারি/ক্যামেরা থেকে ফাইল বেছে নিন (বা ড্র্যাগ করুন)'
                        : 'Choose from phone gallery/camera or computer files (or drag & drop)'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Smartphone className="w-3 h-3 text-cyan-500" />
                      <span>{isBn ? 'ফোন ক্যামেরা / গ্যালারি' : 'Phone'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Monitor className="w-3 h-3 text-indigo-500" />
                      <span>{isBn ? 'পিসি / ল্যাপটপ' : 'Desktop'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">PNG, JPG, WEBP</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Demo Presets if provided */}
      {demoPresets && demoPresets.length > 0 && !value && (
        <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{isBn ? 'নমুনা ছবি:' : 'Presets:'}</span>
          </span>
          {demoPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(preset.url)}
              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 font-medium transition"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {previewZoom && value && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewZoom(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden bg-slate-900 p-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewZoom(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={value} 
              alt="Enlarged Preview" 
              className="max-w-full max-h-[85vh] object-contain rounded-xl mx-auto" 
            />
          </div>
        </div>
      )}
    </div>
  );
};
