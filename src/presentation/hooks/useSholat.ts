'use client';

import { useState, useEffect, useCallback } from 'react';
import { getJadwalSholat, type SholatJadwal } from '@/infrastructure/api/sholatApi';

interface SholatState {
  jadwal: SholatJadwal | null;
  lokasi: string;
  loading: boolean;
  error: string | null;
}

export function useSholat() {
  const [state, setState] = useState<SholatState>({
    jadwal: null,
    lokasi: 'Jakarta',
    loading: true,
    error: null,
  });

  const fetchByLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, loading: false, error: 'Geolocation not supported' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // 1. Get city name from coordinates (Reverse Geocoding)
          const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`);
          const geoData = await geoRes.json();
          const searchKeyword = geoData.city || geoData.locality || geoData.principalSubdivision || 'Jakarta';

          // 2. Find City ID in MyQuran API
          const kotaRes = await fetch(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(searchKeyword)}`);
          const kotaData = await kotaRes.json();
          
          let kotaId = '1301'; // Default Jakarta
          let displayCity = 'Jakarta';

          if (kotaData.status && kotaData.data.length > 0) {
            kotaId = kotaData.data[0].id;
            displayCity = kotaData.data[0].lokasi;
          }

          // 3. Get Prayer Schedule
          const response = await getJadwalSholat(kotaId);
          setState({
            jadwal: response.data.jadwal,
            lokasi: displayCity,
            loading: false,
            error: null,
          });
        } catch (err) {
          console.error('Error fetching prayer times:', err);
          // Fallback to default
          const fallback = await getJadwalSholat('1301');
          setState({
            jadwal: fallback.data.jadwal,
            lokasi: 'Jakarta',
            loading: false,
            error: 'Failed to get location, showing Jakarta',
          });
        }
      },
      async (error) => {
        console.warn('Geolocation error:', error);
        const fallback = await getJadwalSholat('1301');
        setState({
          jadwal: fallback.data.jadwal,
          lokasi: 'Jakarta',
          loading: false,
          error: 'Location access denied',
        });
      }
    );
  }, []);

  useEffect(() => {
    fetchByLocation();
  }, [fetchByLocation]);

  const getNextPrayer = () => {
    if (!state.jadwal) return null;
    
    const times = [
      { name: 'Subuh', time: state.jadwal.subuh },
      { name: 'Dzuhur', time: state.jadwal.dzuhur },
      { name: 'Ashar', time: state.jadwal.ashar },
      { name: 'Maghrib', time: state.jadwal.maghrib },
      { name: 'Isya', time: state.jadwal.isya },
    ];

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const t of times) {
      const [h, m] = t.time.split(':').map(Number);
      if (h * 60 + m > currentMinutes) {
        return t;
      }
    }

    return times[0]; // Tomorrow Subuh
  };

  return {
    ...state,
    nextPrayer: getNextPrayer(),
    refresh: fetchByLocation
  };
}
