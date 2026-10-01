import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Printer,
  ChevronRight,
  Eye,
  Check,
  MessageSquare,
  Users,
  Trash2,
  Calendar,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { GuruPJJ, LaporanPJJ, ProfilSekolah } from '../types';

interface PantauanKepsekPJJProps {
  profil: ProfilSekolah;
  daftarGuru: GuruPJJ[];
  laporanList: LaporanPJJ[];
  onUpdatePemeriksaan: (laporanId: string, status: LaporanPJJ['statusPemeriksaan'], catatan?: string) => void;
  onDeleteLaporan: (laporanId: string) => void;
  onPrintLaporanSingle: (laporan: LaporanPJJ) => void;
  onGoToInput: () => void;
}

export const PantauanKepsekPJJ: React.FC<PantauanKepsekPJJProps> = ({
  profil,
  daftarGuru,
  laporanList,
  onUpdatePemeriksaan,
  onDeleteLaporan,
  onPrintLaporanSingle,
  onGoToInput,
}) => {
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('all');
  const [filterGuru, setFilterGuru] = useState('all');
  const [filterTanggal, setFilterTanggal] = useState('all');
  const [selectedLaporanDetail, setSelectedLaporanDetail] = useState<LaporanPJJ | null>(null);
  const [laporanToDelete, setLaporanToDelete] = useState<LaporanPJJ | null>(null);

  // Note for checking by Kepsek
  const [catatanInput, setCatatanInput] = useState('');

  // Get unique dates
  const availableDates = Array.from(new Set(laporanList.map((l) => l.tanggal))).sort().reverse();
  const latestDate = availableDates[0] || new Date().toISOString().slice(0, 10);

  // Who has reported today / latest date?
  const guruIdsReportedToday = new Set(
    laporanList
      .filter((l) => l.tanggal === latestDate)
      .map((l) => l.guruId)
  );

  const guruSudahLapor = daftarGuru.filter((g) => guruIdsReportedToday.has(g.id));
  const guruBelumLapor = daftarGuru.filter((g) => !guruIdsReportedToday.has(g.id));

  // Compute stats
  const totalSiswaSemuaLaporan = laporanList.reduce((acc, l) => acc + l.jumlahTotalSiswa, 0);
  const totalSiswaHadirSemua = laporanList.reduce((acc, l) => acc + l.jumlahSiswaHadir, 0);
  const persentaseHadirTotal = totalSiswaSemuaLaporan > 0
    ? Math.round((totalSiswaHadirSemua / totalSiswaSemuaLaporan) * 100)
    : 0;

  // Filtered reports
  const filteredLaporan = laporanList.filter((l) => {
    const matchSearch =
      l.guruNama.toLowerCase().includes(search.toLowerCase()) ||
      l.materiPokok.toLowerCase().includes(search.toLowerCase()) ||
      l.mataPelajaran.toLowerCase().includes(search.toLowerCase()) ||
      l.kendalaPJJ.toLowerCase().includes(search.toLowerCase());

    const matchKelas = filterKelas === 'all' || l.kelas === filterKelas;
    const matchGuru = filterGuru === 'all' || l.guruId === filterGuru;
    const matchTanggal = filterTanggal === 'all' || l.tanggal === filterTanggal;

    return matchSearch && matchKelas && matchGuru && matchTanggal;
  });

  const handleOpenDetail = (laporan: LaporanPJJ) => {
    setSelectedLaporanDetail(laporan);
    setCatatanInput(laporan.catatanKepsek || '');
  };

  const handleSavePemeriksaan = (status: LaporanPJJ['statusPemeriksaan']) => {
    if (selectedLaporanDetail) {
      onUpdatePemeriksaan(selectedLaporanDetail.id, status, catatanInput);
      setSelectedLaporanDetail({
        ...selectedLaporanDetail,
        statusPemeriksaan: status,
        catatanKepsek: catatanInput,
        diperiksaOleh: profil.kepalaSekolah,
      });
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'No',
      'Tanggal',
      'Nama Guru',
      'NIP',
      'Kelas',
      'Mata Pelajaran',
      'Materi Pokok',
      'Media PJJ',
      'Total Siswa',
      'Siswa Hadir',
      'Siswa Kendala',
      'Uraian Kegiatan',
      'Penugasan',
      'Kendala PJJ',
      'Status Pemeriksaan',
      'Catatan Kepsek',
    ];

    const rows = filteredLaporan.map((l, idx) => [
      idx + 1,
      `"${l.tanggal}"`,
      `"${l.guruNama}"`,
      `"${l.nip}"`,
      `"${l.kelas}"`,
      `"${l.mataPelajaran}"`,
      `"${l.materiPokok.replace(/"/g, '""')}"`,
      `"${l.mediaPJJ.join('; ')}"`,
      l.jumlahTotalSiswa,
      l.jumlahSiswaHadir,
      l.jumlahSiswaKendala,
      `"${l.uraianKegiatan.replace(/"/g, '""')}"`,
      `"${l.penugasan.replace(/"/g, '""')}"`,
      `"${l.kendalaPJJ.replace(/"/g, '""')}"`,
      `"${l.statusPemeriksaan}"`,
      `"${(l.catatanKepsek || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Laporan_PJJ_SDN32_Rantau_Bayur_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Kepala Sekolah Direct Oversight */}
      <div className="p-5 md:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ClipboardList className="h-4 w-4" />
            <span>Dasbor Pemantauan Kepala Sekolah</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Pantauan Laporan PJJ SDN 32 Rantau Bayur
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Kepala Sekolah: <strong>{profil.kepalaSekolah}</strong> · NPSN: <span className="font-mono">{profil.npsn}</span> · T.A <span className="font-mono">{profil.tahunAjaran}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={onGoToInput}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            <span>+ Input Laporan Guru</span>
          </button>
        </div>
      </div>

      {/* Peringatan Otoritas Menu */}
      <div className="p-4 bg-amber-50/90 border-2 border-amber-300 rounded-2xl flex items-start gap-3 shadow-xs">
        <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
            Pemberitahuan Khusus / Hak Akses Menu
          </h4>
          <p className="text-xs text-amber-900 font-semibold leading-relaxed mt-0.5">
            Dilarang mengedit apapun di menu ini kecuali kepala sekolah atau guru yang ditunjuk, guru hanya mengisi form input guru.
          </p>
        </div>
      </div>

      {/* 2-Card Status Check: Siapa yang Sudah Lapor vs Belum Lapor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Box Sudah Lapor */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <div>
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  Sudah Mengirim Laporan ({guruSudahLapor.length})
                </h3>
                <span className="text-[11px] text-emerald-800">
                  Periode {latestDate}
                </span>
              </div>
            </div>
            <span className="text-lg font-bold font-mono text-emerald-900">
              {guruSudahLapor.length} / {daftarGuru.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {guruSudahLapor.map((guru) => {
              const laporan = laporanList.find(
                (l) => l.guruId === guru.id && l.tanggal === latestDate
              );
              return (
                <div
                  key={guru.id}
                  onClick={() => laporan && handleOpenDetail(laporan)}
                  className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-900 flex items-center gap-1.5 shadow-2xs hover:bg-emerald-100 cursor-pointer transition-colors"
                  title="Klik untuk lihat laporan guru ini"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{guru.nama}</span>
                  {laporan && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({laporan.kelas})
                    </span>
                  )}
                </div>
              );
            })}
            {guruSudahLapor.length === 0 && (
              <span className="text-xs text-slate-500 italic">
                Belum ada laporan yang masuk untuk tanggal ini.
              </span>
            )}
          </div>
        </div>

        {/* Box Belum Lapor */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                !
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                  Belum Mengirim Laporan ({guruBelumLapor.length})
                </h3>
                <span className="text-[11px] text-amber-800">
                  Menunggu input dari guru bersangkutan
                </span>
              </div>
            </div>
            <span className="text-lg font-bold font-mono text-amber-900">
              {guruBelumLapor.length} Guru
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {guruBelumLapor.map((guru) => (
              <div
                key={guru.id}
                className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-xs font-medium text-amber-900 flex items-center gap-1.5 shadow-2xs"
              >
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>{guru.nama}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ({guru.kelasUtama})
                </span>
              </div>
            ))}
            {guruBelumLapor.length === 0 && (
              <span className="text-xs text-emerald-700 font-bold">
                Luar biasa! Seluruh dewan guru telah menginput laporan PJJ.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari guru, materi, kendala..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none font-medium"
          >
            <option value="all">Semua Tanggal</option>
            {availableDates.map((d) => (
              <option key={d} value={d}>
                Tanggal: {d}
              </option>
            ))}
          </select>

          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none font-medium"
          >
            <option value="all">Semua Kelas</option>
            <option value="Kelas 1">Kelas 1</option>
            <option value="Kelas 2">Kelas 2</option>
            <option value="Kelas 3">Kelas 3</option>
            <option value="Kelas 4">Kelas 4</option>
            <option value="Kelas 5">Kelas 5</option>
            <option value="Kelas 6">Kelas 6</option>
          </select>

          <select
            value={filterGuru}
            onChange={(e) => setFilterGuru(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none font-medium max-w-xs truncate"
          >
            <option value="all">Semua Guru</option>
            {daftarGuru.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Feed of Reports */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800">
            Daftar Laporan PJJ yang Masuk ({filteredLaporan.length} Laporan)
          </div>
          <div className="text-[11px] text-slate-500">
            Rata-rata Keikutsertaan Siswa: <strong className="text-emerald-700 font-mono">{persentaseHadirTotal}%</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tanggal & Jam</th>
                <th className="py-3 px-4">Nama Guru & NIP</th>
                <th className="py-3 px-3">Kelas & Mapel</th>
                <th className="py-3 px-3">Materi Pokok</th>
                <th className="py-3 px-3">Media PJJ</th>
                <th className="py-3 px-3 text-center">Partisipasi Siswa</th>
                <th className="py-3 px-4">Status & Catatan Kepsek</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLaporan.map((laporan) => {
                const persenHadir = Math.round(
                  (laporan.jumlahSiswaHadir / (laporan.jumlahTotalSiswa || 1)) * 100
                );

                return (
                  <tr
                    key={laporan.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">
                        {laporan.tanggal}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {laporan.jamMulai} - {laporan.jamSelesai} WIB
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{laporan.guruNama}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        NIP: {laporan.nip}
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-blue-900">{laporan.kelas}</div>
                      <div className="text-[11px] text-slate-600">{laporan.mataPelajaran}</div>
                    </td>

                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-medium text-slate-800 line-clamp-1" title={laporan.materiPokok}>
                        {laporan.materiPokok}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 italic" title={laporan.kendalaPJJ}>
                        Kendala: {laporan.kendalaPJJ}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {laporan.mediaPJJ.map((m) => (
                          <span
                            key={m}
                            className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap font-mono">
                      <span className="font-bold text-slate-900">
                        {laporan.jumlahSiswaHadir}
                      </span>
                      <span className="text-slate-400">/{laporan.jumlahTotalSiswa}</span>
                      <div className="text-[10px] font-semibold text-emerald-700">
                        ({persenHadir}%)
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {laporan.statusPemeriksaan === 'Sudah Diperiksa Kepsek' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Check className="h-3 w-3" />
                            Diperiksa Kepsek
                          </span>
                          {laporan.catatanKepsek && (
                            <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5 italic">
                              "{laporan.catatanKepsek}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock className="h-3 w-3" />
                          Menunggu Diperiksa
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(laporan)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Buka & Periksa Laporan"
                        >
                          Cek Laporan
                        </button>
                        <button
                          onClick={() => setLaporanToDelete(laporan)}
                          className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Laporan Ini"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLaporan.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada laporan PJJ yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail & Pemeriksaan oleh Ibu Kepala Sekolah Anita Muchtar */}
      {selectedLaporanDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-6 space-y-4">
            {/* Header Modal */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Detail Laporan PJJ Guru SDN 32 Rantau Bayur
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedLaporanDetail.guruNama}
                </h3>
                <div className="text-xs text-slate-500 font-mono">
                  NIP: {selectedLaporanDetail.nip} · Dikirim: {selectedLaporanDetail.waktuKirim}
                </div>
              </div>
              <button
                onClick={() => setSelectedLaporanDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Kelas</span>
                <span className="font-bold text-slate-800">{selectedLaporanDetail.kelas}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Mata Pelajaran</span>
                <span className="font-bold text-slate-800">{selectedLaporanDetail.mataPelajaran}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Waktu KBM</span>
                <span className="font-bold font-mono text-slate-800">
                  {selectedLaporanDetail.jamMulai} - {selectedLaporanDetail.jamSelesai}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Kehadiran Siswa</span>
                <span className="font-bold font-mono text-emerald-800">
                  {selectedLaporanDetail.jumlahSiswaHadir} / {selectedLaporanDetail.jumlahTotalSiswa} Siswa
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-200/60">
                <span className="font-bold text-slate-900 block">Materi Pokok:</span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {selectedLaporanDetail.materiPokok}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-200/60">
                <span className="font-bold text-slate-900 block">Uraian Pelaksanaan KBM:</span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedLaporanDetail.uraianKegiatan}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-200/60">
                <span className="font-bold text-slate-900 block">Tugas / Tagihan Siswa:</span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedLaporanDetail.penugasan}
                </p>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl space-y-1 border border-amber-200/60">
                <span className="font-bold text-amber-950 block">Kendala Pembelajaran Jarak Jauh:</span>
                <p className="text-amber-900 leading-relaxed">
                  {selectedLaporanDetail.kendalaPJJ}
                </p>
              </div>

              {/* Foto Bukti if any */}
              {selectedLaporanDetail.fotoBuktiUrl && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 block text-xs">
                    Foto Bukti Dokumentasi / Screenshot KBM:
                  </span>
                  <div className="aspect-16/9 max-h-52 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={selectedLaporanDetail.fotoBuktiUrl}
                      alt="Dokumentasi PJJ"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Rubrik Tindak Lanjut & Arahan Kepala Sekolah: Anita Muchtar, S.Pd.,MM. */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-blue-700" />
                  Catatan & Pengesahan Kepala Sekolah (Ibu Anita Muchtar, S.Pd.,MM.)
                </span>
                <span className="text-[11px] text-blue-700 font-mono">
                  {selectedLaporanDetail.statusPemeriksaan}
                </span>
              </div>

              <textarea
                rows={2}
                value={catatanInput}
                onChange={(e) => setCatatanInput(e.target.value)}
                placeholder="Tuliskan catatan apresiasi, tindak lanjut, atau arahan untuk guru ini..."
                className="w-full px-3 py-2 text-xs bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSavePemeriksaan('Sudah Diperiksa Kepsek')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Tandai Sudah Diperiksa & Sahkan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSavePemeriksaan('Menunggu Diperiksa')}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    Setel Belum Diperiksa
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onPrintLaporanSingle(selectedLaporanDetail)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white rounded-lg border border-slate-300 flex items-center gap-1 transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Cetak Lembar Laporan Ini</span>
                </button>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setLaporanToDelete(selectedLaporanDetail)}
                className="text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus Laporan</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedLaporanDetail(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Laporan (In-App Dialog) */}
      {laporanToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Hapus Laporan PJJ?
              </h3>
              <p className="text-xs text-slate-500">
                Laporan dari <strong className="text-slate-800">{laporanToDelete.guruNama}</strong> ({laporanToDelete.kelas}) tanggal <strong className="text-slate-800">{laporanToDelete.tanggal}</strong> akan dihapus secara permanen.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-left text-[11px] text-slate-600 space-y-1 border border-slate-100">
              <div><strong>Mata Pelajaran:</strong> {laporanToDelete.mataPelajaran}</div>
              <div><strong>Materi Pokok:</strong> {laporanToDelete.materiPokok}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLaporanToDelete(null)}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteLaporan(laporanToDelete.id);
                  if (selectedLaporanDetail?.id === laporanToDelete.id) {
                    setSelectedLaporanDetail(null);
                  }
                  setLaporanToDelete(null);
                }}
                className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                Ya, Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
