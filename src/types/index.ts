export interface GuruPJJ {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  kelasUtama: string;
  mataPelajaranUtama: string;
  noHp?: string;
}

export type MediaPJJType =
  | 'WhatsApp Group'
  | 'Google Classroom'
  | 'Zoom / Google Meet'
  | 'Modul / LKS Mandiri'
  | 'Video YouTube / Pembelajaran'
  | 'Kunjungan Rumah (Home Visit)';

export interface LaporanPJJ {
  id: string;
  guruId: string;
  guruNama: string;
  nip: string;
  tanggal: string; // YYYY-MM-DD
  jamMulai: string;
  jamSelesai: string;
  kelas: string;
  mataPelajaran: string;
  materiPokok: string;
  mediaPJJ: string[];
  jumlahTotalSiswa: number;
  jumlahSiswaHadir: number;
  jumlahSiswaKendala: number;
  uraianKegiatan: string;
  penugasan: string;
  kendalaPJJ: string;
  fotoBuktiUrl?: string;
  waktuKirim: string;
  statusPemeriksaan: 'Sudah Diperiksa Kepsek' | 'Menunggu Diperiksa';
  catatanKepsek?: string;
  diperiksaOleh?: string;
}

export interface ProfilSekolah {
  nama: string;
  npsn: string;
  tahunAjaran: string;
  semester: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  alamat: string;
  kabupaten: string;
  provinsi: string;
  logoUrl: string;
  fotoSekolah: string;
}
