'use client';

/**
 * useAudioStore.ts — Zustand global store for Qur'an audio playback.
 * Persists across page navigation (no re-mount), supports per-ayat
 * playback with highlight tracking and auto-advance.
 */
import { create } from 'zustand';

export type QoriId = '01' | '02' | '03' | '04' | '05';

export interface QoriInfo {
  id: QoriId;
  name: string;
  short: string;
}

export const QORI_LIST: QoriInfo[] = [
  { id: '01', name: 'Abdullah Al-Juhany', short: 'Al-Juhany' },
  { id: '02', name: 'Abdul Muhsin Al-Qasim', short: 'Al-Qasim' },
  { id: '03', name: 'Abdurrahman As-Sudais', short: 'As-Sudais' },
  { id: '04', name: 'Ibrahim Al-Dossari', short: 'Al-Dossari' },
  { id: '05', name: 'Misyari Rasyid Al-Afasi', short: 'Al-Afasi' },
];

export const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];

export interface AudioTrack {
  surahNomor: number;
  surahName: string;
  ayatNomor: number;
  audioByQori: Partial<Record<QoriId, string>>;
}

interface AudioState {
  tracks: AudioTrack[];
  currentIndex: number;
  playing: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  repeat: 'none' | 'one' | 'all';

  qoriId: QoriId;
  playbackRate: PlaybackRate;
  sleepTimerEndsAt: number | null;
  _sleepTimeoutId: ReturnType<typeof setTimeout> | null;

  currentTrack: AudioTrack | null;

  setPlaylist: (tracks: AudioTrack[], startIndex?: number) => void;
  playTrack: (index: number) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  seek: (fraction: number) => void;
  setProgress: (progress: number, currentTime: number, duration: number) => void;
  setPlaying: (playing: boolean) => void;
  toggleRepeat: () => void;
  close: () => void;

  setQori: (qoriId: QoriId) => void;
  setPlaybackRate: (rate: PlaybackRate) => void;
  startSleepTimer: (minutes: number) => void;
  cancelSleepTimer: () => void;

  _onPlaylistEnd: (() => Promise<{ tracks: AudioTrack[]; startIndex?: number } | null> | { tracks: AudioTrack[]; startIndex?: number } | null) | null;
  setOnPlaylistEnd: (cb: AudioState['_onPlaylistEnd']) => void;
  _preloadedKey: string | null;
  _preloadNext: () => void;

  _audio: HTMLAudioElement | null;
  _initAudio: () => HTMLAudioElement;
  _resolveUrl: (track: AudioTrack) => string | null;
}

function loadPrefs(): { qoriId: QoriId; playbackRate: PlaybackRate } {
  if (typeof window === 'undefined') return { qoriId: '05', playbackRate: 1 };
  try {
    const raw = localStorage.getItem('bq-audio-prefs');
    if (!raw) return { qoriId: '05', playbackRate: 1 };
    const parsed = JSON.parse(raw);
    const qoriId: QoriId = ['01', '02', '03', '04', '05'].includes(parsed.qoriId) ? parsed.qoriId : '05';
    const rate: PlaybackRate = (PLAYBACK_RATES as readonly number[]).includes(parsed.playbackRate) ? parsed.playbackRate : 1;
    return { qoriId, playbackRate: rate };
  } catch {
    return { qoriId: '05', playbackRate: 1 };
  }
}

function savePrefs(qoriId: QoriId, playbackRate: PlaybackRate) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('bq-audio-prefs', JSON.stringify({ qoriId, playbackRate }));
  } catch {}
}

const initialPrefs = loadPrefs();

export const useAudioStore = create<AudioState>((set, get) => ({
  tracks: [],
  currentIndex: -1,
  playing: false,
  progress: 0,
  currentTime: 0,
  duration: 0,
  repeat: 'none',

  qoriId: initialPrefs.qoriId,
  playbackRate: initialPrefs.playbackRate,
  sleepTimerEndsAt: null,
  _sleepTimeoutId: null,

  _onPlaylistEnd: null,
  _preloadedKey: null,

  _audio: null,

  get currentTrack() {
    const { tracks, currentIndex } = get();
    return currentIndex >= 0 && currentIndex < tracks.length ? tracks[currentIndex] : null;
  },

  _resolveUrl: (track) => {
    const { qoriId } = get();
    return track.audioByQori[qoriId] || track.audioByQori['05'] || Object.values(track.audioByQori)[0] || null;
  },

  _initAudio: () => {
    let audio = get()._audio;
    if (audio) return audio;

    audio = new Audio();
    audio.preload = 'auto';
    audio.playbackRate = get().playbackRate;

    audio.addEventListener('timeupdate', () => {
      const dur = audio!.duration || 0;
      const cur = audio!.currentTime;
      set({
        currentTime: cur,
        duration: dur,
        progress: dur > 0 ? cur / dur : 0,
      });
      // Smart preload: when 50%+ done, warm cache for next track
      if (dur > 0 && cur / dur > 0.5) {
        get()._preloadNext();
      }
    });

    audio.addEventListener('ended', async () => {
      const { repeat, currentIndex, tracks, _onPlaylistEnd } = get();
      if (repeat === 'one') {
        audio!.currentTime = 0;
        audio!.play();
        return;
      }
      if (currentIndex < tracks.length - 1) {
        get().next();
        return;
      }
      if (repeat === 'all' && tracks.length > 0) {
        get().playTrack(0);
        return;
      }
      // End of playlist — try to load next surah
      if (_onPlaylistEnd) {
        try {
          const result = await _onPlaylistEnd();
          if (result && result.tracks.length > 0) {
            get().setPlaylist(result.tracks, result.startIndex ?? 0);
            return;
          }
        } catch (err) {
          console.warn('onPlaylistEnd failed:', err);
        }
      }
      set({ playing: false, progress: 0 });
    });

    audio.addEventListener('loadedmetadata', () => {
      set({ duration: audio!.duration });
    });

    set({ _audio: audio });
    return audio;
  },

  setPlaylist: (tracks, startIndex = 0) => {
    const audio = get()._initAudio();
    set({ tracks, currentIndex: startIndex });
    const track = tracks[startIndex];
    if (track) {
      const url = get()._resolveUrl(track);
      if (!url) return;
      audio.src = url;
      audio.load();
      audio.playbackRate = get().playbackRate;
      audio.play().then(() => set({ playing: true })).catch(() => {});
    }
  },

  playTrack: (index) => {
    const { tracks } = get();
    if (index < 0 || index >= tracks.length) return;
    const audio = get()._initAudio();
    const track = tracks[index];
    const url = get()._resolveUrl(track);
    if (!url) return;
    set({ currentIndex: index, progress: 0, currentTime: 0 });
    audio.src = url;
    audio.load();
    audio.playbackRate = get().playbackRate;
    audio.play().then(() => set({ playing: true })).catch(() => {});
  },

  togglePlay: () => {
    const { playing, _audio, tracks, currentIndex } = get();
    if (!_audio || tracks.length === 0) return;
    if (playing) {
      _audio.pause();
      set({ playing: false });
    } else {
      if (currentIndex < 0) {
        get().playTrack(0);
      } else {
        _audio.play().then(() => set({ playing: true })).catch(() => {});
      }
    }
  },

  pause: () => {
    get()._audio?.pause();
    set({ playing: false });
  },

  resume: () => {
    const audio = get()._audio;
    if (audio) {
      audio.play().then(() => set({ playing: true })).catch(() => {});
    }
  },

  next: () => {
    const { currentIndex, tracks } = get();
    if (currentIndex < tracks.length - 1) {
      get().playTrack(currentIndex + 1);
    }
  },

  prev: () => {
    const { currentIndex, _audio } = get();
    if (_audio && _audio.currentTime > 3) {
      _audio.currentTime = 0;
      return;
    }
    if (currentIndex > 0) {
      get().playTrack(currentIndex - 1);
    }
  },

  seek: (fraction) => {
    const audio = get()._audio;
    if (audio && audio.duration) {
      audio.currentTime = fraction * audio.duration;
    }
  },

  setProgress: (progress, currentTime, duration) => set({ progress, currentTime, duration }),
  setPlaying: (playing) => set({ playing }),
  toggleRepeat: () => {
    const { repeat } = get();
    const next = repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none';
    set({ repeat: next });
  },

  close: () => {
    const audio = get()._audio;
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    get().cancelSleepTimer();
    set({ tracks: [], currentIndex: -1, playing: false, progress: 0, currentTime: 0, duration: 0 });
  },

  setQori: (qoriId) => {
    const { _audio, currentTrack, playing, playbackRate } = get();
    set({ qoriId });
    savePrefs(qoriId, playbackRate);
    if (!_audio || !currentTrack) return;
    const url = currentTrack.audioByQori[qoriId] || currentTrack.audioByQori['05'] || Object.values(currentTrack.audioByQori)[0];
    if (!url) return;
    const resumeAt = _audio.currentTime;
    _audio.src = url;
    _audio.load();
    _audio.addEventListener(
      'loadedmetadata',
      () => {
        _audio.currentTime = Math.min(resumeAt, _audio.duration || resumeAt);
        _audio.playbackRate = playbackRate;
        if (playing) _audio.play().catch(() => {});
      },
      { once: true }
    );
  },

  setPlaybackRate: (rate) => {
    const { _audio, qoriId } = get();
    set({ playbackRate: rate });
    savePrefs(qoriId, rate);
    if (_audio) _audio.playbackRate = rate;
  },

  startSleepTimer: (minutes) => {
    get().cancelSleepTimer();
    const endsAt = Date.now() + minutes * 60_000;
    const id = setTimeout(() => {
      get().pause();
      set({ sleepTimerEndsAt: null, _sleepTimeoutId: null });
    }, minutes * 60_000);
    set({ sleepTimerEndsAt: endsAt, _sleepTimeoutId: id });
  },

  cancelSleepTimer: () => {
    const { _sleepTimeoutId } = get();
    if (_sleepTimeoutId) clearTimeout(_sleepTimeoutId);
    set({ sleepTimerEndsAt: null, _sleepTimeoutId: null });
  },

  setOnPlaylistEnd: (cb) => {
    set({ _onPlaylistEnd: cb });
  },

  _preloadNext: () => {
    if (typeof window === 'undefined') return;
    const { tracks, currentIndex, _preloadedKey } = get();
    const nextIdx = currentIndex + 1;
    if (nextIdx >= tracks.length) return;
    const url = get()._resolveUrl(tracks[nextIdx]);
    if (!url) return;
    const key = `${currentIndex}::${url}`;
    if (_preloadedKey === key) return;
    set({ _preloadedKey: key });
    // Warm browser/SW cache without playing
    fetch(url, { mode: 'no-cors', cache: 'force-cache' }).catch(() => {});
  },
}));
