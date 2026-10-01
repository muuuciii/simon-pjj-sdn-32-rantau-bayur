import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  Calendar,
  Clock,
  BookOpen,
  Users,
  Camera,
  AlertCircle,
  PlusCircle,
  HelpCircle,
  Smartphone,
  Check,
} from 'lucide-react';
import { GuruPJJ, LaporanPJJ, MediaPJJType } from '../types';

interface FormInputPJJProps {
  daftarGuru: GuruPJJ[];
  onSubmitLaporan: (laporan: LaporanPJJ) => void;
  onOpenTambahGuru: () => void;
  onGoToPantauan: () => void;
}

export const FormInputPJJ: React.FC<FormInputPJJProps> = ({
  daftarGuru,
  onSubmitLaporan,
  onOpenTambahGuru,
  onGoToPantauan,
}) => {
  // Today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().slice(0, 10);

  // Form states
  const [selectedGuruId, setSelectedGuruId] = useState<string>(
    daftarGuru[0]?.id || ''
  );
  const [tanggal, setTanggal] = useState<string>(todayStr);
  const [jamMulai, setJamMulai] = useState<string>('08.00');
  const [jamSelesai, setJamSelesai] = useState<string>('09.30');
  const [kelas, setKelas] = useState<string>('Kelas 4');
  const [mataPelajaran, setMataPelajaran] = useState<string>('Tematik / IPAS');
  const [materiPokok, setMateriPokok] = useState<string>('');
  const [mediaPJJ, setMediaPJJ] = useState<MediaPJJType[]>([
    'WhatsApp Group',
    'Modul / LKS Mandiri',
  ]);
  const [totalSiswa, setTotalSiswa] = useState<number>(24);
  const [siswaHadir, setSiswaHadir] = useState<number>(22);
  const [siswaKendala, setSiswaKendala] = useState<number>(2);
  const [uraianKegiatan, setUraianKegiatan] = useState<string>('');
  const [penugasan, setPenugasan] = useState<string>('');
  const [kendalaPJJ, setKendalaPJJ] = useState<string>(
    'Sebagian siswa terlambat merespon karena gawai bergantian dengan orang tua.'
  );
  const [fotoBukti, setFotoBukti] = useState<string | null>(null);

  // Submission success indicator
  const [isSuccessSubmitted, setIsSuccessSubmitted] = useState<boolean>(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string>('');

  useEffect(() => {
    if (!selectedGuruId && daftarGuru.length > 0) {
      handleTeacherChange(daftarGuru[0].id);
    } else if (daftarGuru.length > 0 && !daftarGuru.some((g) => g.id === selectedGuruId)) {
      handleTeacherChange(daftarGuru[0].id);
    }
  }, [daftarGuru, selectedGuruId]);

  // When teacher is selected, autofill primary class and subject
  const handleTeacherChange = (guruId: string) => {
    setSelectedGuruId(guruId);
    const g = daftarGuru.find((item) => item.id === guruId);
    if (g) {
      if (g.kelasUtama && g.kelasUtama !== 'Kelas 1 s/d 6' && g.kelasUtama !== 'Administrasi') {
        setKelas(g.kelasUtama);
      }
      if (g.mataPelajaranUtama) {
        setMataPelajaran(g.mataPelajaranUtama);
      }
    }
  };

  const handleMediaToggle = (media: MediaPJJType) => {
    if (mediaPJJ.includes(media)) {
      setMediaPJJ(mediaPJJ.filter((m) => m !== media));
    } else {
      setMediaPJJ([...mediaPJJ, media]);
    }
  };

  const handleTotalChange = (val: number) => {
    setTotalSiswa(val);
    setSiswaKendala(Math.max(0, val - siswaHadir));
  };

  const handleHadirChange = (val: number) => {
    setSiswaHadir(val);
    setSiswaKendala(Math.max(0, totalSiswa - val));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoBukti(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedGuru =
      daftarGuru.find((g) => g.id === selectedGuruId) || daftarGuru[0];

    const nowFormatted = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    const newReport: LaporanPJJ = {
      id: `pjj-${Date.now()}`,
      guruId: selectedGuru.id,
      guruNama: selectedGuru.nama,
      nip: selectedGuru.nip,
      tanggal,
      jamMulai,
      jamSelesai,
      kelas,
      mataPelajaran,
      materiPokok:
        materiPokok || 'Pembelajaran Tematik & Penguatan Materi PJJ',
      mediaPJJ: mediaPJJ.length > 0 ? mediaPJJ : ['WhatsApp Group'],
      jumlahTotalSiswa: totalSiswa,
      jumlahSiswaHadir: siswaHadir,
      jumlahSiswaKendala: siswaKendala,
      uraianKegiatan:
        uraianKegiatan ||
        'Guru memberikan instruksi dan materi melalui grup WhatsApp kelas, dilanjutkan tanya jawab dan bimbingan pengerjaan tugas mandiri.',
      penugasan:
        penugasan ||
        'Mengerjakan latihan soal di lembar kerja siswa (LKS) dan difoto lalu dikirimkan ke guru.',
      kendalaPJJ:
        kendalaPJJ ||
        'Sebagian siswa lambat merespon karena kendala jaringan atau gawai bergantian.',
      fotoBuktiUrl: fotoBukti || undefined,
      waktuKirim: `${nowFormatted} WIB`,
      statusPemeriksaan: 'Menunggu Diperiksa',
    };

    onSubmitLaporan(newReport);
    setLastSubmittedId(newReport.id);
    setIsSuccessSubmitted(true);

    // Reset some inputs for next potential entry
    setMateriPokok('');
    setUraianKegiatan('');
    setPenugasan('');
    setFotoBukti(null);

    // Scroll top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentGuru = daftarGuru.find((g) => g.id === selectedGuruId);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Success Banner */}
      {isSuccessSubmitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950">
                Laporan PJJ Berhasil Dikirim!
              </h4>
              <p className="text-xs text-emerald-800">
                Laporan Anda telah tersimpan dan langsung masuk ke dasbor pemantauan <strong>Kepala Sekolah Ibu Anita Muchtar, S.Pd.,MM.</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSuccessSubmitted(false)}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/60 rounded-lg transition-colors"
            >
              Tutup Pesan
            </button>
            <button
              onClick={onGoToPantauan}
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors"
            >
              Lihat Pantauan Kepsek →
            </button>
          </div>
        </div>
      )}

      {/* Main Card Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Form Title & Context */}
        <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
              <Smartphone className="h-4 w-4" />
              <span>Formulir Mandiri Guru SDN 32 Rantau Bayur</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Input Laporan Pembelajaran Jarak Jauh (PJJ)
            </h2>
            <p className="text-xs text-blue-100/90 mt-1">
              Silakan pilih nama Anda dan isi rincian KBM PJJ hari ini. Laporan akan langsung dipantau oleh Kepala Sekolah.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenTambahGuru}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-100 bg-white/10 hover:bg-white/20 rounded-xl transition-colors shrink-0"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>+ Nama Guru Baru</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Identitas Guru & Waktu PJJ */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>01. Identitas Guru & Waktu Pembelajaran</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Select Guru */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-800">
                    Nama Guru Pelapor *
                  </label>
                  <button
                    type="button"
                    onClick={onOpenTambahGuru}
                    className="text-xs text-blue-700 hover:text-blue-900 font-bold hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>+ Tambah Nama Guru Baru</span>
                  </button>
                </div>

                {daftarGuru.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                    <p className="text-xs text-amber-900 font-semibold">
                      Belum ada data nama guru. Silakan masukkan nama guru SDN 32 Rantau Bayur terlebih dahulu.
                    </p>
                    <button
                      type="button"
                      onClick={onOpenTambahGuru}
                      className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Klik di Sini untuk Menambah Nama Guru</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <select
                        value={selectedGuruId}
                        onChange={(e) => handleTeacherChange(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      >
                        <option value="" disabled>
                          -- Pilih Nama Guru --
                        </option>
                        {daftarGuru.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.nama} — {g.jabatan} (NIP: {g.nip})
                          </option>
                        ))}
                      </select>
                    </div>
                    {currentGuru && (
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>NIP: <strong className="font-mono text-slate-700">{currentGuru.nip}</strong></span>
                        <span>·</span>
                        <span>Tugas: <strong className="text-slate-700">{currentGuru.jabatan}</strong></span>
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Tanggal PJJ */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Tanggal Pelaksanaan PJJ *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
                  />
                </div>
              </div>

              {/* Waktu Jam KBM */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Waktu / Jam KBM (WIB) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={jamMulai}
                    onChange={(e) => setJamMulai(e.target.value)}
                    placeholder="Mulai (08.00)"
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-center"
                  />
                  <input
                    type="text"
                    required
                    value={jamSelesai}
                    onChange={(e) => setJamSelesai(e.target.value)}
                    placeholder="Selesai (09.30)"
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Kelas & Materi PJJ */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>02. Kelas, Mata Pelajaran & Media Pembelajaran</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Kelas yang Diajar *
                </label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                >
                  <option value="Kelas 1">Kelas 1</option>
                  <option value="Kelas 2">Kelas 2</option>
                  <option value="Kelas 3">Kelas 3</option>
                  <option value="Kelas 4">Kelas 4</option>
                  <option value="Kelas 5">Kelas 5</option>
                  <option value="Kelas 6">Kelas 6</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Mata Pelajaran *
                </label>
                <input
                  type="text"
                  required
                  value={mataPelajaran}
                  onChange={(e) => setMataPelajaran(e.target.value)}
                  placeholder="Contoh: Tematik, IPAS, Matematika, PAI, PJOK"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Materi Pokok / Topik Pembelajaran *
                </label>
                <input
                  type="text"
                  required
                  value={materiPokok}
                  onChange={(e) => setMateriPokok(e.target.value)}
                  placeholder="Contoh: Perkalian Pecahan Campuran, Ekosistem Sungai Rantau Bayur, Surah Pendek..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
                />
              </div>

              {/* Media PJJ (Multiple Checkboxes) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Media / Saluran PJJ yang Digunakan (Bisa pilih lebih dari satu) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'WhatsApp Group',
                      'Modul / LKS Mandiri',
                      'Video YouTube / Pembelajaran',
                      'Google Classroom',
                      'Zoom / Google Meet',
                      'Kunjungan Rumah (Home Visit)',
                    ] as MediaPJJType[]
                  ).map((m) => {
                    const isChecked = mediaPJJ.includes(m);
                    return (
                      <button
                        type="button"
                        key={m}
                        onClick={() => handleMediaToggle(m)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all ${
                          isChecked
                            ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-2xs'
                            : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        <div
                          className={`h-4 w-4 rounded flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{m}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Keikutsertaan Siswa */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>03. Keikutsertaan Siswa dalam PJJ</span>
            </h3>

            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Total Jumlah Siswa Kelas
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={totalSiswa}
                  onChange={(e) => handleTotalChange(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-base font-bold font-mono text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-emerald-800 mb-1">
                  Jumlah Siswa Mengikuti / Hadir
                </label>
                <input
                  type="number"
                  min={0}
                  max={totalSiswa}
                  required
                  value={siswaHadir}
                  onChange={(e) => handleHadirChange(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-emerald-50/60 border border-emerald-300 rounded-xl text-base font-bold font-mono text-emerald-800 text-center focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-800 mb-1">
                  Siswa Terkendala / Tidak Hadir
                </label>
                <input
                  type="number"
                  min={0}
                  value={siswaKendala}
                  onChange={(e) => setSiswaKendala(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-amber-50/60 border border-amber-300 rounded-xl text-base font-bold font-mono text-amber-800 text-center focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
              <span>
                Persentase Partisipasi Kelas:
              </span>
              <span className="font-mono font-bold text-blue-700">
                {Math.round((siswaHadir / (totalSiswa || 1)) * 100)}% Keikutsertaan
              </span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 4: Ringkasan Kegiatan & Kendala */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>04. Uraian KBM, Penugasan & Kendala Lapangan</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Ringkasan Pelaksanaan KBM Daring / PJJ Hari Ini *
              </label>
              <textarea
                rows={3}
                required
                value={uraianKegiatan}
                onChange={(e) => setUraianKegiatan(e.target.value)}
                placeholder="Contoh: Mengirimkan video pengantar materi melalui grup WA, dilanjutkan sesi tanya jawab pesan suara bersama murid dan panduan pengerjaan modul mandiri..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Tugas / Tagihan yang Diberikan kepada Siswa *
              </label>
              <input
                type="text"
                required
                value={penugasan}
                onChange={(e) => setPenugasan(e.target.value)}
                placeholder="Contoh: Mengerjakan 5 soal di buku latihan dan difoto dikirimkan via WA paling lambat pukul 15.00 WIB"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Kendala yang Dihadapi (Siswa / Guru)
              </label>
              <textarea
                rows={2}
                value={kendalaPJJ}
                onChange={(e) => setKendalaPJJ(e.target.value)}
                placeholder="Contoh: Sinyal internet siswa kurang stabil, gawai dibawa orang tua ke kebun, atau tulis 'Tidak ada kendala / KBM berjalan lancar'..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* Upload Bukti Dokumentasi */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Foto Bukti Dokumentasi PJJ (Opsional: Screenshot WA / Hasil Kerja Murid)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {fotoBukti && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Foto Terlampir
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">
              * Laporan otomatis tersimpan dan dapat langsung diperiksa Kepala Sekolah.
            </span>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span>Kirim Laporan PJJ Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
