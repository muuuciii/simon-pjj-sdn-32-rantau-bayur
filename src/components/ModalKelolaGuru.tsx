import React, { useState } from 'react';
import { GuruPJJ } from '../types';
import { UserPlus, X, Trash2, Users, AlertTriangle } from 'lucide-react';

interface ModalKelolaGuruProps {
  isOpen: boolean;
  onClose: () => void;
  daftarGuru: GuruPJJ[];
  onAddGuru: (guru: GuruPJJ) => void;
  onDeleteGuru: (guruId: string) => void;
  onClearAllGuru: () => void;
}

export const ModalKelolaGuru: React.FC<ModalKelolaGuruProps> = ({
  isOpen,
  onClose,
  daftarGuru,
  onAddGuru,
  onDeleteGuru,
  onClearAllGuru,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'daftar'>('form');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [jabatan, setJabatan] = useState('Guru Kelas');
  const [kelasUtama, setKelasUtama] = useState('Kelas 1');
  const [mapelUtama, setMapelUtama] = useState('Tematik');
  const [noHp, setNoHp] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    const newGuru: GuruPJJ = {
      id: `g-${Date.now()}`,
      nama: nama.trim(),
      nip: nip.trim() || '-',
      jabatan: jabatan.trim(),
      kelasUtama,
      mataPelajaranUtama: mapelUtama.trim(),
      noHp: noHp.trim(),
    };

    onAddGuru(newGuru);
    setNama('');
    setNip('');
    setNoHp('');
    setActiveTab('daftar');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Kelola Dewan Guru SDN 32
              </h3>
              <p className="text-[11px] text-slate-500">
                Total terdaftar: <strong>{daftarGuru.length} Guru</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'form'
                ? 'bg-white text-blue-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>+ Tambah Guru Baru</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('daftar')}
            className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'daftar'
                ? 'bg-white text-blue-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Daftar Guru ({daftarGuru.length})</span>
          </button>
        </div>

        {/* Tab 1: Form Input Guru Baru */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs overflow-y-auto pr-1">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap & Gelar Guru *
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Rina Melati, S.Pd."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  NIP (Jika Ada)
                </label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="1987..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  No. WhatsApp / HP
                </label>
                <input
                  type="text"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  placeholder="0812-xxxx"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jabatan / Tugas
                </label>
                <input
                  type="text"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="Contoh: Guru Kelas IV"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kelas Utama
                </label>
                <select
                  value={kelasUtama}
                  onChange={(e) => setKelasUtama(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  <option value="Kelas 1">Kelas 1</option>
                  <option value="Kelas 2">Kelas 2</option>
                  <option value="Kelas 3">Kelas 3</option>
                  <option value="Kelas 4">Kelas 4</option>
                  <option value="Kelas 5">Kelas 5</option>
                  <option value="Kelas 6">Kelas 6</option>
                  <option value="Kelas 1 s/d 6">Kelas 1 s/d 6 (Bidang Studi)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mata Pelajaran Utama
              </label>
              <input
                type="text"
                value={mapelUtama}
                onChange={(e) => setMapelUtama(e.target.value)}
                placeholder="Contoh: Tematik, Matematika, PAI, PJOK"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
              >
                Tutup
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition-colors shadow-2xs"
              >
                + Simpan Guru Baru
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Daftar Guru Terdaftar & Fitur Hapus */}
        {activeTab === 'daftar' && (
          <div className="space-y-3 text-xs overflow-y-auto pr-1 flex-1 flex flex-col justify-between">
            {daftarGuru.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                <Users className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-600">
                  Belum ada nama guru yang tersimpan.
                </p>
                <p className="text-[11px] text-slate-400">
                  Silakan beralih ke tab <strong>"+ Tambah Guru Baru"</strong> untuk menginput nama guru pertama.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className="mt-2 px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-xs"
                >
                  + Tambah Guru Sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1">
                  <span>Daftar Guru Aktif ({daftarGuru.length})</span>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="text-rose-600 hover:text-rose-800 font-bold hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Hapus Semua Guru</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {daftarGuru.map((guru, idx) => (
                    <div
                      key={guru.id}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">
                          {idx + 1}. {guru.nama}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
                          <span>{guru.jabatan}</span>
                          <span>·</span>
                          <span className="font-mono text-slate-600">NIP: {guru.nip}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteGuru(guru.id)}
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                        title="Hapus guru ini"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Confirm Clear All */}
            {showClearConfirm && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 mt-2">
                <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>Kosongkan Semua Nama Guru?</span>
                </div>
                <p className="text-[11px] text-rose-700">
                  Seluruh {daftarGuru.length} data guru akan dihapus agar Anda dapat memulai input baru dari awal.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClearAllGuru();
                      setShowClearConfirm(false);
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                  >
                    Ya, Kosongkan Semua
                  </button>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>+ Tambah Guru Lainnya</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
              >
                Selesai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

