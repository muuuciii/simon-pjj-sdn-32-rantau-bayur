import React from 'react';
import {
  FileText,
  ClipboardList,
  Printer,
  Calendar,
  School,
  Award,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Smartphone,
  BookOpen,
  MapPin,
  Clock,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { ProfilSekolah, GuruPJJ, LaporanPJJ } from '../types';

interface HomePJJProps {
  profil: ProfilSekolah;
  daftarGuru: GuruPJJ[];
  laporanList: LaporanPJJ[];
  onNavigate: (view: 'input' | 'pantauan' | 'cetak') => void;
  onOpenTambahGuru: () => void;
  onOpenUbahLogo?: () => void;
}

export const HomePJJ: React.FC<HomePJJProps> = ({
  profil,
  daftarGuru,
  laporanList,
  onNavigate,
  onOpenTambahGuru,
  onOpenUbahLogo,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const laporanHariIni = laporanList.filter((l) => l.tanggal === todayStr);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white shadow-lg p-6 sm:p-8 md:p-10 border border-blue-900/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-blue-200 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              <span>Portal Resmi SIMON PJJ</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Sistem Monitoring Pembelajaran Jarak Jauh (PJJ)
            </h1>

            <p className="text-sm md:text-base font-medium text-blue-100/90 leading-relaxed">
              {profil.nama} · Kabupaten Banyuasin, Sumatera Selatan
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-blue-200/90 pt-1">
              <span className="flex items-center gap-1 font-mono">
                NPSN: <strong className="text-white">{profil.npsn}</strong>
              </span>
              <span aria-hidden="true" className="text-blue-400">·</span>
              <span>Tahun Ajaran <strong className="text-white">{profil.tahunAjaran}</strong></span>
              <span aria-hidden="true" className="text-blue-400">·</span>
              <span>Semester <strong className="text-white">{profil.semester}</strong></span>
            </div>

            <div className="flex items-start gap-2 text-xs text-blue-200/80 pt-1">
              <MapPin className="h-4 w-4 shrink-0 text-blue-300 mt-0.5" />
              <span>{profil.alamat}</span>
            </div>
          </div>

          {/* Logo & Principal Lockup */}
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center flex flex-col items-center justify-center shrink-0 min-w-56 space-y-2">
            <div className="relative group">
              <div className="h-20 w-20 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center">
                <img
                  src={profil.logoUrl}
                  alt="Logo SDN 32"
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              {onOpenUbahLogo && (
                <button
                  onClick={onOpenUbahLogo}
                  className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[10px] font-semibold transition-colors"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>Ganti Logo</span>
                </button>
              )}
            </div>
            <div>
              <div className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">
                Kepala Sekolah
              </div>
              <div className="text-xs font-extrabold text-white mt-0.5">
                {profil.kepalaSekolah}
              </div>
              <div className="text-[10px] text-blue-300 font-mono mt-0.5">
                NIP. {profil.nipKepalaSekolah}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Main Access Gateways (Akses Guru vs Pantauan Kepala Sekolah) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Gateway 1: Form Input Guru (Tema Hijau Emerald Segar) */}
        <div
          onClick={() => onNavigate('input')}
          className="group relative bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/30 p-6 rounded-3xl border-2 border-emerald-200 shadow-sm hover:shadow-lg hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              {/* Gambar / Icon Box Warna Hijau Guru */}
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-emerald-600/25">
                <FileText className="h-7 w-7" />
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Akses Dewan Guru
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">
                Formulir Input Laporan PJJ
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Bapak/Ibu dewan guru silakan mengisi laporan pelaksanaan KBM daring / PJJ hari ini. Pilih nama guru, kelas, mata pelajaran, materi, serta kendala lapangan.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>Buka Formulir Input Laporan</span>
            <ArrowRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Gateway 2: Pantauan Kepala Sekolah (Tema Biru Navy / Indigo Kedinasan) */}
        <div
          onClick={() => onNavigate('pantauan')}
          className="group relative bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/30 p-6 rounded-3xl border-2 border-blue-200 shadow-sm hover:shadow-lg hover:border-blue-600 transition-all cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              {/* Gambar / Icon Box Warna Biru Royal Kepsek */}
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-blue-700/25">
                <ClipboardList className="h-7 w-7" />
              </div>
              <span className="text-xs font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
                Akses Kepala Sekolah
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                Pantauan & Hasil Laporan PJJ
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Memantau secara langsung laporan guru yang masuk hari ini, memeriksa keaktifan kelas, memberikan catatan/pengesahan, serta mencetak rekapitulasi resmi.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-blue-100 flex items-center justify-between text-xs font-bold text-blue-800">
            <span>Buka Dasbor Pantauan Kepsek</span>
            <ArrowRight className="h-4 w-4 text-blue-700 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Informasi Keadaan & Tata Tertib Penggunaan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Live Widget */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">
            Tanggal Pemantauan
          </div>
          <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span>{todayFormatted}</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1">
            {laporanHariIni.length} laporan PJJ telah terkirim hari ini
          </div>
        </div>

        {/* Guru Terdaftar Widget */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-2">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase">
              Total Guru Terdaftar
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {daftarGuru.length} <span className="text-xs font-normal text-slate-500">Guru</span>
            </div>
          </div>
          <button
            onClick={onOpenTambahGuru}
            className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>+ Tambah Nama Guru</span>
          </button>
        </div>

        {/* Quick Print Gateway */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-2">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase">
              Rekapitulasi Kedinasan
            </div>
            <div className="text-xs font-bold text-slate-900">
              Format Standar A4 Berkop Surat
            </div>
            <div className="text-[11px] text-slate-500">
              Tanda Tangan Kepala Sekolah
            </div>
          </div>
          <button
            onClick={() => onNavigate('cetak')}
            className="w-full py-1.5 px-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Rekap & Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Petunjuk Penggunaan Singkat */}
      <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-2">
        <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-blue-700" />
          <span>Panduan Pengisian Laporan PJJ Guru</span>
        </h3>
        <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1 leading-relaxed">
          <li>
            Pilih menu <strong>"Form Input Guru"</strong> dan pilih nama Bapak/Ibu guru dari daftar. Jika nama belum ada, klik <strong>"+ Tambah Nama Guru Baru"</strong>.
          </li>
          <li>
            Isi tanggal KBM, kelas yang diajar, mata pelajaran, materi pokok, media yang dipakai (WhatsApp, Modul/LKS, dll.), serta jumlah siswa yang hadir dan kendalanya.
          </li>
          <li>
            Klik tombol <strong>"Kirim Laporan PJJ Sekarang"</strong>. Laporan otomatis tersimpan dan dapat langsung diperiksa oleh Kepala Sekolah Ibu Anita Muchtar, S.Pd.,MM.
          </li>
        </ol>
      </div>
    </div>
  );
};
