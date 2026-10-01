import React, { useRef, useState } from 'react';
import { X, Upload, RotateCcw, Check, Image as ImageIcon } from 'lucide-react';
import { PROFIL_SEKOLAH } from '../data/initialData';

interface ModalUbahLogoProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogoUrl: string;
  onUpdateLogo: (newLogoUrl: string) => void;
}

export const ModalUbahLogo: React.FC<ModalUbahLogoProps> = ({
  isOpen,
  onClose,
  currentLogoUrl,
  onUpdateLogo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentLogoUrl);
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (< 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2 MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPreviewUrl(result);
          onUpdateLogo(result);
          setSuccessMsg('Logo berhasil diperbarui dari file Anda!');
          setTimeout(() => setSuccessMsg(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetDefault = () => {
    setPreviewUrl(PROFIL_SEKOLAH.logoUrl);
    onUpdateLogo(PROFIL_SEKOLAH.logoUrl);
    setSuccessMsg('Logo dikembalikan ke default.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Official Tut Wuri Handayani vector/standard URL
  const tutWuriUrl = 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg';

  const handleSelectTutWuri = () => {
    setPreviewUrl(tutWuriUrl);
    onUpdateLogo(tutWuriUrl);
    setSuccessMsg('Logo resmi Tut Wuri Handayani dipilih!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Ganti Logo Sekolah</h3>
              <p className="text-xs text-slate-500">Sesuaikan logo untuk SIMON PJJ dan Kop Surat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Current Preview */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
            <div className="h-24 w-24 rounded-2xl bg-white p-2 shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden">
              <img
                src={previewUrl}
                alt="Logo Sekolah"
                className="h-full w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center">
              <span className="text-xs font-semibold text-slate-700">Pratinjau Logo Saat Ini</span>
              <p className="text-[11px] text-slate-500">Logo ini tampil di Header, Beranda, dan Kop Surat Cetak</p>
            </div>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Action 1: Upload from Device */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Unggah Logo dari Laptop / HP (PNG / JPG)</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-1">
              Maksimal 2 MB (Disarankan format PNG transparan)
            </p>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400">Atau Pilihan Lain</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSelectTutWuri}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left text-xs transition-colors flex items-center gap-2"
            >
              <div className="h-7 w-7 rounded bg-white p-0.5 border border-slate-200 flex items-center justify-center shrink-0">
                <img src={tutWuriUrl} alt="Tut Wuri" className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-[11px]">Tut Wuri Handayani</div>
                <div className="text-[9px] text-slate-500">Kemendikbudristek</div>
              </div>
            </button>

            <button
              onClick={handleResetDefault}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left text-xs transition-colors flex items-center gap-2"
            >
              <div className="h-7 w-7 rounded bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <RotateCcw className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-[11px]">Reset ke Bawaan</div>
                <div className="text-[9px] text-slate-500">Logo Asli Sistem</div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
