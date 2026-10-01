import { GuruPJJ, LaporanPJJ, ProfilSekolah } from '../types';
import schoolBuildingImg from '../assets/images/school_building_sdn_1790835446774.jpg';
import schoolEmblemImg from '../assets/images/sdn32_emblem_1790835431375.jpg';

export const PROFIL_SEKOLAH: ProfilSekolah = {
  nama: 'SDN 32 Rantau Bayur',
  npsn: '10602612',
  tahunAjaran: '2026/2027',
  semester: 'Ganjil',
  kepalaSekolah: 'Anita Muchtar, S.Pd.,MM.',
  nipKepalaSekolah: '196906121991042001',
  alamat: 'Jln. PT. Melania Sipef Desa Talang Kemang, Kec. Rantau Bayur, Kab. Banyuasin',
  kabupaten: 'Kabupaten Banyuasin',
  provinsi: 'Sumatera Selatan',
  logoUrl: schoolEmblemImg,
  fotoSekolah: schoolBuildingImg,
};

export const DAFTAR_GURU_INITIAL: GuruPJJ[] = [];

export const INITIAL_LAPORAN_PJJ: LaporanPJJ[] = [];
