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
import { ModalUbahLogo } from './components/ModalUbahLogo';

import {
  PROFIL_SEKOLAH,
  DAFTAR_GURU_INITIAL,
  INITIAL_LAPORAN_PJJ,
} from './data/initialData';
import { GuruPJJ, LaporanPJJ, ProfilSekolah } from './types';
import { Home, FileText, ClipboardList, Printer, Cloud, RefreshCw } from 'lucide-react';
import {
  subscribeToLaporan,
  saveLaporanOnline,
  updatePemeriksaanOnline,
  deleteLaporanOnline,
  subscribeToGuru,
  saveGuruOnline,
  deleteGuruOnline,
} from './services/firestoreService';
import { testConnection } from './lib/firebase';

export default function App() {
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(true);
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'offline'>('connected');

  // State for School Profile (including editable logo)
  const [profil, setProfil] = useState<ProfilSekolah>(() => {
    try {
      const customLogo = localStorage.getItem('simon_pjj_custom_logo');
      if (customLogo) {
        return {
          ...PROFIL_SEKOLAH,
          logoUrl: customLogo,
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
  const [isUbahLogoOpen, setIsUbahLogoOpen] = useState<boolean>(false);

  // Real-time synchronization with Cloud Firestore
  useEffect(() => {
    testConnection();

    // Subscribe to real-time reports
    const unsubLaporan = subscribeToLaporan(
      async (cloudLaporan) => {
        // Cek jika cloud masih kosong tapi ada laporan lokal lama yang belum terunggah
        const localSaved = localStorage.getItem('simon_pjj_laporan_clean');
        if (localSaved && cloudLaporan.length === 0) {
          try {
            const parsedLocal: LaporanPJJ[] = JSON.parse(localSaved);
            if (parsedLocal.length > 0) {
              for (const lap of parsedLocal) {
                await saveLaporanOnline(lap);
              }
              return;
            }
          } catch (e) {
            console.error('Gagal sinkron laporan lokal ke cloud:', e);
          }
        }

        setLaporanList(cloudLaporan);
        localStorage.setItem('simon_pjj_laporan_clean', JSON.stringify(cloudLaporan));
        setIsCloudSyncing(false);
        setCloudStatus('connected');
      },
      () => {
        setCloudStatus('offline');
        setIsCloudSyncing(false);
      }
    );

    // Subscribe to real-time teachers
    const unsubGuru = subscribeToGuru(
      async (cloudGuru) => {
        // Cek jika cloud masih kosong tapi ada data guru lokal lama
        const localSavedGuru = localStorage.getItem('simon_pjj_guru_v5');
        if (localSavedGuru && cloudGuru.length === 0) {
          try {
            const parsedGuru: GuruPJJ[] = JSON.parse(localSavedGuru);
            if (parsedGuru.length > 0) {
              for (const g of parsedGuru) {
                await saveGuruOnline(g);
              }
              return;
            }
          } catch (e) {
            console.error('Gagal sinkron guru lokal ke cloud:', e);
          }
        }

        setDaftarGuru(cloudGuru);
        localStorage.setItem('simon_pjj_guru_v5', JSON.stringify(cloudGuru));
      },
      () => {
        setCloudStatus('offline');
      }
    );

    return () => {
      unsubLaporan();
      unsubGuru();
    };
  }, []);

  // Sync to LocalStorage as safety backup
  useEffect(() => {
    localStorage.setItem('simon_pjj_guru_v5', JSON.stringify(daftarGuru));
  }, [daftarGuru]);

  useEffect(() => {
    localStorage.setItem('simon_pjj_laporan_clean', JSON.stringify(laporanList));
  }, [laporanList]);

  // Handlers
  const handleUpdateLogo = (newLogoUrl: string) => {
    if (newLogoUrl === PROFIL_SEKOLAH.logoUrl) {
      localStorage.removeItem('simon_pjj_custom_logo');
    } else {
      localStorage.setItem('simon_pjj_custom_logo', newLogoUrl);
    }
    setProfil((prev) => ({ ...prev, logoUrl: newLogoUrl }));
  };

  const handleAddNewLaporan = async (newLaporan: LaporanPJJ) => {
    // Optimistic UI update
    setLaporanList((prev) => [newLaporan, ...prev]);
    // Save to Cloud Database
    try {
      await saveLaporanOnline(newLaporan);
    } catch (err) {
      console.error('Gagal sinkron laporan ke cloud:', err);
    }
  };

  const handleUpdatePemeriksaan = async (
    laporanId: string,
    status: LaporanPJJ['statusPemeriksaan'],
    catatan?: string
  ) => {
    // Optimistic UI update
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
    // Sync to Cloud Database
    try {
      await updatePemeriksaanOnline(laporanId, status, catatan || '');
    } catch (err) {
      console.error('Gagal update pemeriksaan ke cloud:', err);
    }
  };

  const handleDeleteLaporan = async (laporanId: string) => {
    // Optimistic UI update
    setLaporanList((prev) => prev.filter((l) => l.id !== laporanId));
    // Delete from Cloud Database
    try {
      await deleteLaporanOnline(laporanId);
    } catch (err) {
      console.error('Gagal menghapus laporan dari cloud:', err);
    }
  };

  const handlePrintLaporanSingle = (laporan: LaporanPJJ) => {
    setSingleLaporanForPrint(laporan);
    setActiveView('cetak');
  };

  const handleAddGuru = async (newGuru: GuruPJJ) => {
    // Optimistic UI update
    setDaftarGuru((prev) => [...prev, newGuru]);
    // Save to Cloud Database
    try {
      await saveGuruOnline(newGuru);
    } catch (err) {
      console.error('Gagal menyimpan guru ke cloud:', err);
    }
  };

  const handleDeleteGuru = async (guruId: string) => {
    // Optimistic UI update
    setDaftarGuru((prev) => prev.filter((g) => g.id !== guruId));
    // Delete from Cloud Database
    try {
      await deleteGuruOnline(guruId);
    } catch (err) {
      console.error('Gagal menghapus guru dari cloud:', err);
    }
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
        onOpenUbahLogo={() => setIsUbahLogoOpen(true)}
      />

      {/* Cloud Sync Status Banner */}
      <div className="bg-emerald-50 border-b border-emerald-200/80 px-4 py-1.5 text-xs text-emerald-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-900">
              Cloud Database Aktif
            </span>
            <span className="text-emerald-700 hidden md:inline">
              — Tersinkronisasi otomatis antar semua perangkat (HP Guru & Laptop Kepala Sekolah).
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-medium text-[11px] bg-emerald-100/70 px-2 py-0.5 rounded-full">
              {laporanList.length} Laporan Online
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeView === 'home' && (
          <HomePJJ
            profil={profil}
            daftarGuru={daftarGuru}
            laporanList={laporanList}
            onNavigate={(view) => setActiveView(view)}
            onOpenTambahGuru={() => setIsTambahGuruOpen(true)}
            onOpenUbahLogo={() => setIsUbahLogoOpen(true)}
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

      {/* Modal Ubah Logo Sekolah */}
      <ModalUbahLogo
        isOpen={isUbahLogoOpen}
        onClose={() => setIsUbahLogoOpen(false)}
        currentLogoUrl={profil.logoUrl}
        onUpdateLogo={handleUpdateLogo}
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
