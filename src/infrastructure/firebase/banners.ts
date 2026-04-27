import { db, storage } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  query,
  orderBy,
  limit,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface Banner {
  id: string;
  imageUrl: string;
  createdAt: Date;
}

// ─── Upload banner image to Firebase Storage ───
export async function uploadBannerImage(file: File): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageRef = ref(storage, `banners/${timestamp}_${safeName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

// ─── Create banner ───
export async function createBanner(imageUrl: string): Promise<string> {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, 'banners'), {
    imageUrl,
    createdAt: now,
  });
  return docRef.id;
}

// ─── Delete banner ───
export async function deleteBanner(id: string, imageUrl: string): Promise<void> {
  // Delete from Firestore
  await deleteDoc(doc(db, 'banners', id));
  
  // Try to delete from Storage if it's a firebase storage URL
  try {
    if (imageUrl.includes('firebasestorage.googleapis.com')) {
      const urlObj = new URL(imageUrl);
      const pathPaths = urlObj.pathname.split('/o/');
      if (pathPaths.length > 1) {
        const filePath = decodeURIComponent(pathPaths[1].split('?')[0]);
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
      }
    }
  } catch (e) {
    console.error('Failed to delete image from storage:', e);
  }
}

// ─── Get banners (latest first, max 7) ───
export async function getBanners(maxItems = 7): Promise<Banner[]> {
  const q = query(
    collection(db, 'banners'),
    orderBy('createdAt', 'desc'),
    limit(maxItems)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      imageUrl: data.imageUrl,
      createdAt: data.createdAt?.toDate() ?? new Date(),
    };
  });
}
