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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Article {
  id: string;
  title: string;
  content: string; // markdown
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Upload thumbnail to Firebase Storage ───
export async function uploadThumbnail(file: File): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageRef = ref(storage, `articles/thumbnails/${timestamp}_${safeName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

// ─── Create article ───
export async function createArticle(data: {
  title: string;
  content: string;
  thumbnailUrl: string;
}): Promise<string> {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, 'articles'), {
    title: data.title,
    content: data.content,
    thumbnailUrl: data.thumbnailUrl,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

// ─── Update article ───
export async function updateArticle(
  id: string,
  data: { title?: string; content?: string; thumbnailUrl?: string }
): Promise<void> {
  const docRef = doc(db, 'articles', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// ─── Delete article ───
export async function deleteArticle(id: string): Promise<void> {
  await deleteDoc(doc(db, 'articles', id));
}

// ─── Get articles (latest first) ───
export async function getArticles(maxItems = 20): Promise<Article[]> {
  const q = query(
    collection(db, 'articles'),
    orderBy('createdAt', 'desc'),
    limit(maxItems)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title,
      content: data.content,
      thumbnailUrl: data.thumbnailUrl,
      createdAt: data.createdAt?.toDate() ?? new Date(),
      updatedAt: data.updatedAt?.toDate() ?? new Date(),
    };
  });
}

// ─── Get single article by ID ───
export async function getArticleById(id: string): Promise<Article | null> {
  const docRef = doc(db, 'articles', id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    title: data.title,
    content: data.content,
    thumbnailUrl: data.thumbnailUrl,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
  };
}

// ─── Get adjacent articles (for prev/next navigation) ───
export async function getAdjacentArticles(currentId: string): Promise<{
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}> {
  // Get all articles ordered by date to find prev/next
  const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const articles = snap.docs.map((d) => ({ id: d.id, title: d.data().title }));
  
  const currentIndex = articles.findIndex((a) => a.id === currentId);
  if (currentIndex === -1) return { prev: null, next: null };

  return {
    // "prev" = newer article (index - 1)
    prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
    // "next" = older article (index + 1)
    next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
  };
}
