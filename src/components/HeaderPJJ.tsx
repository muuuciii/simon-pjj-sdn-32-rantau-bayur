import React from 'react';
import {
  Home,
  FileText,
  ClipboardList,
  Printer,
  Calendar,
  School,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { ProfilSekolah } from '../types';

interface HeaderPJJProps {
  profil: ProfilSekolah;
  activeView: 'home' | 'input' | 'pantauan' | 'cetak';
  onViewChange: (view: 'home' | 'input' | 'pantauan' | 'cetak') => void;
  laporanHariIniCount: number;
  totalGuruCount: number;
}

export const HeaderPJJ: React.FC<HeaderPJJProps> = ({
  profil,
  activeView,
  onViewChange,
  laporanHariIniCount,
  totalGuruCount,
}) => {
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      {/* Top Bar Contract (1 Row, 3 Zones) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark & School Branding */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo Sekolah Terkunci (Locked) */}
          <div className="h-11 w-11 rounded-xl overflow-hidden border border-slate-200 shadow-2xs flex items-center justify-center bg-slate-50 shrink-0">
            <img
              src={profil.logoUrl}
              alt="Logo SDN 32"
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-blue-950 whitespace-nowrap">
                SIMON PJJ
              </span>
              <span className="text-slate-300 font-mono">·</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                {profil.nama}
              </span>
            </div>
            {/* Teks di bawah SIMON PJJ sesuai permintaan */}
            <div className="text-xs font-semibold text-blue-800 truncate leading-snug">
              Sistem Monitoring Pembelajaran Jarak Jauh
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => onViewChange('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeView === 'home'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onViewChange('input')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeView === 'input'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Form Input Guru</span>
          </button>

          <button
            onClick={() => onViewChange('pantauan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeView === 'pantauan'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            <span>Pantauan Kepala Sekolah</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeView === 'pantauan'
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {laporanHariIniCount}/{totalGuruCount}
            </span>
          </button>

          <button
            onClick={() => onViewChange('cetak')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeView === 'cetak'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Rekap & Cetak</span>
          </button>
        </nav>

        {/* Zone 3: Quick Action */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800 leading-tight">
              {profil.kepalaSekolah}
            </div>
            <div className="text-[10px] text-slate-500">
              Kepala Sekolah SDN 32
            </div>
          </div>
          <button
            onClick={() => onViewChange('cetak')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: Academic Year & Date information */}
      <div className="bg-slate-50 border-t border-slate-200/70 text-slate-500 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-900">
              Tahun Ajaran {profil.tahunAjaran}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Semester {profil.semester}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono text-slate-700 font-medium">
              NPSN: {profil.npsn}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <span>{todayFormatted}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
