import React from 'react';
import { Printer, Download, ArrowLeft, Check, Award } from 'lucide-react';
import { LaporanPJJ, ProfilSekolah } from '../types';

interface CetakLaporanPJJProps {
  profil: ProfilSekolah;
  laporanList: LaporanPJJ[];
  singleLaporan?: LaporanPJJ | null;
  onBack: () => void;
}

export const CetakLaporanPJJ: React.FC<CetakLaporanPJJProps> = ({
  profil,
  laporanList,
  singleLaporan,
  onBack,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

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
      'Kendala PJJ',
      'Status Pemeriksaan',
      'Catatan Kepsek',
    ];

    const dataToExport = singleLaporan ? [singleLaporan] : laporanList;

    const rows = dataToExport.map((l, idx) => [
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
      `Laporan_PJJ_SDN32_Rantau_Bayur_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Control Actions (Hidden on Print) */}
      <div className="no-print max-w-4xl mx-auto bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Kembali ke Pantauan"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Format Cetak Dokumen Kedinasan (Standar A4)
            </h2>
            <p className="text-xs text-slate-500">
              NPSN: <span className="font-mono">{profil.npsn}</span> · Tahun Ajaran: <span className="font-mono">{profil.tahunAjaran}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Unduh CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs transition-colors active:scale-95"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Dokumen Sekarang (PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="print-page bg-white max-w-4xl mx-auto p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm text-slate-900 space-y-6">
        {/* Kop Surat Resmi */}
        <div className="text-center relative pb-3 border-b-4 border-double border-slate-900">
          <div className="absolute left-0 top-1 h-20 w-20 flex items-center justify-center">
            <img
              src={profil.logoUrl}
              alt="Logo SDN 32"
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="px-16 space-y-0.5">
            <h3 className="text-sm md:text-base font-bold tracking-wider uppercase text-slate-800">
              Pemerintah Kabupaten Banyuasin
            </h3>
            <h2 className="text-base md:text-lg font-extrabold tracking-wide uppercase text-slate-900">
              Dinas Pendidikan dan Kebudayaan
            </h2>
            <h1 className="text-lg md:text-xl font-black tracking-tight uppercase text-blue-950">
              {profil.nama}
            </h1>
            <p className="text-[11px] text-slate-600 leading-tight">
              NPSN: {profil.npsn} · {profil.alamat} · Kab. Banyuasin, Prov. Sumatera Selatan
            </p>
          </div>
        </div>

        {/* SINGLE REPORT SHEET */}
        {singleLaporan ? (
          <div className="space-y-4 text-xs">
            <div className="text-center space-y-1">
              <h2 className="text-sm font-bold uppercase underline tracking-wide">
                Laporan Pelaksanaan Pembelajaran Jarak Jauh (PJJ) Guru
              </h2>
              <p className="text-xs text-slate-600 font-mono">
                Tahun Ajaran {profil.tahunAjaran} · Semester {profil.semester}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-300">
              <div>
                <strong>Nama Guru:</strong> {singleLaporan.guruNama}
              </div>
              <div>
                <strong>NIP:</strong> {singleLaporan.nip}
              </div>
              <div>
                <strong>Kelas:</strong> {singleLaporan.kelas}
              </div>
              <div>
                <strong>Mata Pelajaran:</strong> {singleLaporan.mataPelajaran}
              </div>
              <div>
                <strong>Tanggal / Waktu:</strong> {singleLaporan.tanggal} ({singleLaporan.jamMulai} - {singleLaporan.jamSelesai} WIB)
              </div>
              <div>
                <strong>Media PJJ:</strong> {singleLaporan.mediaPJJ.join(', ')}
              </div>
              <div>
                <strong>Kehadiran Siswa:</strong> {singleLaporan.jumlahSiswaHadir} dari {singleLaporan.jumlahTotalSiswa} Siswa (
                {Math.round((singleLaporan.jumlahSiswaHadir / (singleLaporan.jumlahTotalSiswa || 1)) * 100)}%)
              </div>
              <div>
                <strong>Siswa Terkendala:</strong> {singleLaporan.jumlahSiswaKendala} Siswa
              </div>
            </div>

            <div className="border border-slate-300 rounded-lg p-3 space-y-2">
              <div>
                <strong>Materi Pokok Pembelajaran:</strong>
                <p className="text-slate-800 mt-0.5">{singleLaporan.materiPokok}</p>
              </div>
              <div>
                <strong>Uraian Kegiatan KBM PJJ:</strong>
                <p className="text-slate-700 mt-0.5 leading-relaxed">{singleLaporan.uraianKegiatan}</p>
              </div>
              <div>
                <strong>Bentuk Tugas / Tagihan yang Diberikan:</strong>
                <p className="text-slate-700 mt-0.5">{singleLaporan.penugasan}</p>
              </div>
              <div>
                <strong>Kendala yang Dihadapi:</strong>
                <p className="text-slate-700 mt-0.5 italic">{singleLaporan.kendalaPJJ}</p>
              </div>
              {singleLaporan.catatanKepsek && (
                <div className="p-2 bg-blue-50/60 rounded border border-blue-200 text-blue-950">
                  <strong>Catatan / Arahan Kepala Sekolah:</strong>
                  <p className="italic mt-0.5">{singleLaporan.catatanKepsek}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* REKAPITULASI SELURUH LAPORAN PJJ */
          <div className="space-y-4 text-xs">
            <div className="text-center space-y-1">
              <h2 className="text-sm md:text-base font-bold uppercase underline tracking-wide">
                Rekapitulasi Laporan Pembelajaran Jarak Jauh (PJJ)
              </h2>
              <p className="text-xs text-slate-600 font-mono">
                Tahun Ajaran {profil.tahunAjaran} · NPSN: {profil.npsn}
              </p>
            </div>

            <div className="border border-slate-400 rounded-lg overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 font-bold border-b border-slate-300 text-slate-900">
                  <tr>
                    <th className="py-2 px-2 text-center w-8">No</th>
                    <th className="py-2 px-2">Tanggal</th>
                    <th className="py-2 px-3">Nama Guru & NIP</th>
                    <th className="py-2 px-2">Kelas</th>
                    <th className="py-2 px-2">Mapel</th>
                    <th className="py-2 px-3">Materi Pokok</th>
                    <th className="py-2 px-2">Media</th>
                    <th className="py-2 px-2 text-center">Partisipasi</th>
                    <th className="py-2 px-3">Kendala Siswa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {laporanList.map((l, idx) => (
                    <tr key={l.id}>
                      <td className="py-2 px-2 text-center font-mono">{idx + 1}</td>
                      <td className="py-2 px-2 whitespace-nowrap font-mono">{l.tanggal}</td>
                      <td className="py-2 px-3">
                        <div className="font-semibold text-slate-900">{l.guruNama}</div>
                        <div className="text-[10px] text-slate-500 font-mono">NIP: {l.nip}</div>
                      </td>
                      <td className="py-2 px-2 font-bold">{l.kelas}</td>
                      <td className="py-2 px-2">{l.mataPelajaran}</td>
                      <td className="py-2 px-3 max-w-xs">{l.materiPokok}</td>
                      <td className="py-2 px-2 text-[10px]">{l.mediaPJJ[0]}</td>
                      <td className="py-2 px-2 text-center font-mono">
                        {l.jumlahSiswaHadir}/{l.jumlahTotalSiswa}
                      </td>
                      <td className="py-2 px-3 text-[10px] italic text-slate-600">{l.kendalaPJJ}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tanda Tangan & Pengesahan Resmi Kepala Sekolah */}
        <div className="pt-8 flex justify-end text-xs">
          <div className="text-center space-y-1 w-72">
            <p className="text-slate-700">
              Talang Kemang, {todayFormatted}
            </p>
            <p className="font-semibold text-slate-900">
              Kepala Sekolah,
            </p>
            <div className="h-20" />
            <p className="font-extrabold underline text-slate-950 text-sm">
              {profil.kepalaSekolah}
            </p>
            <p className="text-[11px] text-slate-600 font-mono">
              NIP. {profil.nipKepalaSekolah}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
