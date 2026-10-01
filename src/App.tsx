/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeaderPJJ } from './components/HeaderPJJ';
import { HomePJJ } from './components/HomePJJ';
import { FormInputPJJ } from './components/FormInputPJJ';
import { PantauanKepsekPJJ } from './components/PantauanKepsekPJJ';
import { CetakLaporanPJJ } from './components/CetakLaporanPJJ';
import { ModalKelolaGuru } from './components/ModalKelolaGuru';

import {
  PROFIL_SEKOLAH,
  DAFTAR_GURU_INITIAL,
  INITIAL_LAPORAN_PJJ,
} from './data/initialData';
import { GuruPJJ, LaporanPJJ, ProfilSekolah } from './types';
import { Home, FileText, ClipboardList, Printer } from 'lucide-react';

export default function App() {
  // State for School Profile (including editable logo)
  const [profil, setProfil] = useState<ProfilSekolah>(() => {
    try {
      const saved = localStorage.getItem('simon_pjj_profil');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...PROFIL_SEKOLAH,
          logoUrl: parsed.logoUrl || PROFIL_SEKOLAH.logoUrl,
          nipKepalaSekolah: PROFIL_SEKOLAH.nipKepalaSekolah,
          alamat: PROFIL_SEKOLAH.alamat,
        };
      }
      return PROFIL_SEKOLAH;
    } catch {
      return PROFIL_SEKOLAH;
    }
  });

  // State for Teachers (clean empty list for fresh input)
  const [daftarGuru, setDaftarGuru] = useState<GuruPJJ[]>(() => {
    try {
      const saved = localStorage.getItem('simon_pjj_guru_v5');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // State for PJJ Reports
  const [laporanList, setLaporanList] = useState<LaporanPJJ[]>(() => {
    try {
      const saved = localStorage.getItem('simon_pjj_laporan_clean');
      return saved ? JSON.parse(saved) : INITIAL_LAPORAN_PJJ;
    } catch {
      return INITIAL_LAPORAN_PJJ;
    }
  });

  // Active view: 'home' for Landing, 'input' for teachers, 'pantauan' for Kepsek, 'cetak' for printable summary
  const [activeView, setActiveView] = useState<'home' | 'input' | 'pantauan' | 'cetak'>('home');
  const [singleLaporanForPrint, setSingleLaporanForPrint] = useState<LaporanPJJ | null>(null);
  const [isTambahGuruOpen, setIsTambahGuruOpen] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('simon_pjj_profil', JSON.stringify(profil));
  }, [profil]);

  useEffect(() => {
    localStorage.setItem('simon_pjj_guru_v5', JSON.stringify(daftarGuru));
  }, [daftarGuru]);

  useEffect(() => {
    localStorage.setItem('simon_pjj_laporan_clean', JSON.stringify(laporanList));
  }, [laporanList]);

  // Handlers
  const handleAddNewLaporan = (newLaporan: LaporanPJJ) => {
    setLaporanList((prev) => [newLaporan, ...prev]);
  };

  const handleUpdatePemeriksaan = (
    laporanId: string,
    status: LaporanPJJ['statusPemeriksaan'],
    catatan?: string
  ) => {
    setLaporanList((prev) =>
      prev.map((l) =>
        l.id === laporanId
          ? {
              ...l,
              statusPemeriksaan: status,
              catatanKepsek: catatan,
              diperiksaOleh: profil.kepalaSekolah,
            }
          : l
      )
    );
  };

  const handleDeleteLaporan = (laporanId: string) => {
    setLaporanList((prev) => prev.filter((l) => l.id !== laporanId));
  };

  const handlePrintLaporanSingle = (laporan: LaporanPJJ) => {
    setSingleLaporanForPrint(laporan);
    setActiveView('cetak');
  };

  const handleAddGuru = (newGuru: GuruPJJ) => {
    setDaftarGuru((prev) => [...prev, newGuru]);
  };

  const handleDeleteGuru = (guruId: string) => {
    setDaftarGuru((prev) => prev.filter((g) => g.id !== guruId));
  };

  const handleClearAllGuru = () => {
    setDaftarGuru([]);
  };

  // Count reports submitted today
  const todayStr = new Date().toISOString().slice(0, 10);
  const uniqueTeachersReportedToday = new Set(
    laporanList.filter((l) => l.tanggal === todayStr).map((l) => l.guruId)
  ).size;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <HeaderPJJ
        profil={profil}
        activeView={activeView}
        onViewChange={(view) => {
          if (view !== 'cetak') setSingleLaporanForPrint(null);
          setActiveView(view);
        }}
        laporanHariIniCount={uniqueTeachersReportedToday}
        totalGuruCount={daftarGuru.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeView === 'home' && (
          <HomePJJ
            profil={profil}
            daftarGuru={daftarGuru}
            laporanList={laporanList}
            onNavigate={(view) => setActiveView(view)}
            onOpenTambahGuru={() => setIsTambahGuruOpen(true)}
          />
        )}

        {activeView === 'input' && (
          <FormInputPJJ
            daftarGuru={daftarGuru}
            onSubmitLaporan={handleAddNewLaporan}
            onOpenTambahGuru={() => setIsTambahGuruOpen(true)}
            onGoToPantauan={() => setActiveView('pantauan')}
          />
        )}

        {activeView === 'pantauan' && (
          <PantauanKepsekPJJ
            profil={profil}
            daftarGuru={daftarGuru}
            laporanList={laporanList}
            onUpdatePemeriksaan={handleUpdatePemeriksaan}
            onDeleteLaporan={handleDeleteLaporan}
            onPrintLaporanSingle={handlePrintLaporanSingle}
            onGoToInput={() => setActiveView('input')}
          />
        )}

        {activeView === 'cetak' && (
          <CetakLaporanPJJ
            profil={profil}
            laporanList={laporanList}
            singleLaporan={singleLaporanForPrint}
            onBack={() => {
              setSingleLaporanForPrint(null);
              setActiveView('pantauan');
            }}
          />
        )}
      </main>

      {/* Mobile Bottom Sticky Navigation (no-print) */}
      <div className="md:hidden no-print sticky bottom-0 z-30 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => {
            setSingleLaporanForPrint(null);
            setActiveView('home');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[11px] font-semibold transition-colors ${
            activeView === 'home' ? 'text-blue-700' : 'text-slate-500'
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setSingleLaporanForPrint(null);
            setActiveView('input');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[11px] font-semibold transition-colors ${
            activeView === 'input' ? 'text-blue-700' : 'text-slate-500'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Input Guru</span>
        </button>

        <button
          onClick={() => {
            setSingleLaporanForPrint(null);
            setActiveView('pantauan');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[11px] font-semibold transition-colors ${
            activeView === 'pantauan' ? 'text-blue-700' : 'text-slate-500'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          <span>Pantauan</span>
        </button>

        <button
          onClick={() => {
            setActiveView('cetak');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[11px] font-semibold transition-colors ${
            activeView === 'cetak' ? 'text-blue-700' : 'text-slate-500'
          }`}
        >
          <Printer className="h-4 w-4" />
          <span>Cetak</span>
        </button>
      </div>

      {/* Modal Kelola & Tambah Nama Guru Baru */}
      <ModalKelolaGuru
        isOpen={isTambahGuruOpen}
        onClose={() => setIsTambahGuruOpen(false)}
        daftarGuru={daftarGuru}
        onAddGuru={handleAddGuru}
        onDeleteGuru={handleDeleteGuru}
        onClearAllGuru={handleClearAllGuru}
      />

      {/* Footer (no-print) */}
      <footer className="no-print mt-auto py-4 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <p>
          SIMON PJJ · Sistem Informasi Monitoring Pembelajaran Jarak Jauh
        </p>
        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
          {profil.nama} · NPSN: <span className="font-mono">{profil.npsn}</span> · T.A {profil.tahunAjaran}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Kepala Sekolah: <strong>{profil.kepalaSekolah}</strong> (NIP: {profil.nipKepalaSekolah})
        </p>
      </footer>
    </div>
  );
}
