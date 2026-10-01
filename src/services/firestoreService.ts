import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { GuruPJJ, LaporanPJJ } from '../types';

const LAPORAN_COLLECTION = 'laporan_pjj';
const GURU_COLLECTION = 'guru_pjj';

/**
 * Mendengarkan data laporan PJJ secara real-time dari Cloud Database
 */
export function subscribeToLaporan(
  onData: (laporan: LaporanPJJ[]) => void,
  onError?: (err: unknown) => void
) {
  const colRef = collection(db, LAPORAN_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: LaporanPJJ[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as LaporanPJJ);
      });
      // Urutkan dari yang terbaru (tanggal desc)
      list.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, LAPORAN_COLLECTION);
      if (onError) onError(error);
    }
  );
}

function cleanPayload<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Menyimpan laporan PJJ baru ke Cloud Database
 */
export async function saveLaporanOnline(laporan: LaporanPJJ): Promise<void> {
  const docRef = doc(db, LAPORAN_COLLECTION, laporan.id);
  try {
    const dataToSave = cleanPayload(laporan);
    await setDoc(docRef, dataToSave);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${LAPORAN_COLLECTION}/${laporan.id}`);
    throw error;
  }
}

/**
 * Mengupdate status pemeriksaan laporan oleh Kepala Sekolah
 */
export async function updatePemeriksaanOnline(
  laporanId: string,
  status: LaporanPJJ['statusPemeriksaan'],
  catatanKepsek: string
): Promise<void> {
  const docRef = doc(db, LAPORAN_COLLECTION, laporanId);
  try {
    await updateDoc(docRef, {
      statusPemeriksaan: status,
      catatanKepsek: catatanKepsek,
      tanggalDiperiksa: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${LAPORAN_COLLECTION}/${laporanId}`);
    throw error;
  }
}

/**
 * Menghapus laporan dari Cloud Database
 */
export async function deleteLaporanOnline(laporanId: string): Promise<void> {
  const docRef = doc(db, LAPORAN_COLLECTION, laporanId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${LAPORAN_COLLECTION}/${laporanId}`);
    throw error;
  }
}

/**
 * Mendengarkan data dewan guru secara real-time
 */
export function subscribeToGuru(
  onData: (guruList: GuruPJJ[]) => void,
  onError?: (err: unknown) => void
) {
  const colRef = collection(db, GURU_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: GuruPJJ[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as GuruPJJ);
      });
      // Urutkan berdasarkan nama
      list.sort((a, b) => a.nama.localeCompare(b.nama));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, GURU_COLLECTION);
      if (onError) onError(error);
    }
  );
}

/**
 * Menyimpan data guru baru ke Cloud Database
 */
export async function saveGuruOnline(guru: GuruPJJ): Promise<void> {
  const docRef = doc(db, GURU_COLLECTION, guru.id);
  try {
    const dataToSave = cleanPayload(guru);
    await setDoc(docRef, dataToSave);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${GURU_COLLECTION}/${guru.id}`);
    throw error;
  }
}

/**
 * Menghapus data guru dari Cloud Database
 */
export async function deleteGuruOnline(guruId: string): Promise<void> {
  const docRef = doc(db, GURU_COLLECTION, guruId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${GURU_COLLECTION}/${guruId}`);
    throw error;
  }
}
