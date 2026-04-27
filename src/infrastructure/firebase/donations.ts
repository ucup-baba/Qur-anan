import { db, storage } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  limit,
  Timestamp,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  collectedAmount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Upload poster to Firebase Storage ───
export async function uploadDonationPoster(file: File): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageRef = ref(storage, `donations/posters/${timestamp}_${safeName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

// ─── Create donation campaign ───
export async function createDonationCampaign(data: {
  title: string;
  description: string;
  posterUrl: string;
}): Promise<string> {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, 'donations'), {
    title: data.title,
    description: data.description,
    posterUrl: data.posterUrl,
    collectedAmount: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

// ─── Update donation campaign ───
export async function updateDonationCampaign(
  id: string,
  data: Partial<Omit<DonationCampaign, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const docRef = doc(db, 'donations', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// ─── Delete donation campaign ───
export async function deleteDonationCampaign(id: string, posterUrl: string): Promise<void> {
  await deleteDoc(doc(db, 'donations', id));
  
  try {
    if (posterUrl.includes('firebasestorage.googleapis.com')) {
      const urlObj = new URL(posterUrl);
      const pathPaths = urlObj.pathname.split('/o/');
      if (pathPaths.length > 1) {
        const filePath = decodeURIComponent(pathPaths[1].split('?')[0]);
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
      }
    }
  } catch (e) {
    console.error('Failed to delete poster from storage:', e);
  }
}

// ─── Get all campaigns ───
export async function getDonationCampaigns(activeOnly = false): Promise<DonationCampaign[]> {
  const q = query(
    collection(db, 'donations'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  const results = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title,
      description: data.description,
      posterUrl: data.posterUrl,
      collectedAmount: data.collectedAmount ?? 0,
      isActive: data.isActive ?? true,
      createdAt: data.createdAt?.toDate() ?? new Date(),
      updatedAt: data.updatedAt?.toDate() ?? new Date(),
    };
  });

  if (activeOnly) {
    return results.filter(r => r.isActive);
  }
  return results;
}
