'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';
import { Icon, Icons } from '@/presentation/components/icons';
import type { SholatJadwal } from '@/infrastructure/api/sholatApi';

interface SholatClientProps {
  initialJadwal: SholatJadwal | null;
  initialLokasi: string;
  initialDateStr: string;
}

export function SholatClient({ initialJadwal, initialLokasi, initialDateStr }: SholatClientProps) {
  const [jadwalData, setJadwalData] = useState<SholatJadwal | null>(initialJadwal);
  const [lokasi, setLokasi] = useState<string>(initialLokasi);
  const [dateStr, setDateStr] = useState<string>(initialDateStr);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const PRAYER_TIMES = jadwalData ? [
    { name: 'Imsak', time: jadwalData.imsak, icon: Icons.Clock },
    { name: 'Subuh', time: jadwalData.subuh, icon: Icons.Clock },
    { name: 'Dzuhur', time: jadwalData.dzuhur, icon: Icons.Clock },
    { name: 'Ashar', time: jadwalData.ashar, icon: Icons.Clock },
    { name: 'Maghrib', time: jadwalData.maghrib, icon: Icons.Moon },
    { name: 'Isya', time: jadwalData.isya, icon: Icons.Moon },
  ] : [
    { name: 'Imsak', time: '--:--', icon: Icons.Clock },
    { name: 'Subuh', time: '--:--', icon: Icons.Clock },
    { name: 'Dzuhur', time: '--:--', icon: Icons.Clock },
    { name: 'Ashar', time: '--:--', icon: Icons.Clock },
    { name: 'Maghrib', time: '--:--', icon: Icons.Moon },
    { name: 'Isya', time: '--:--', icon: Icons.Moon },
  ];

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolokasi tidak didukung oleh browser Anda.');
      return;
    }

    setIsLoadingGPS(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // 1. Reverse Geocode to get City name
          const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`);
          const geoData = await geoRes.json();
          
          // Use city or locality for searching
          const searchKeyword = geoData.city || geoData.locality || geoData.principalSubdivision;
          if (!searchKeyword) throw new Error('Tidak dapat menemukan nama kota dari lokasi Anda.');

          // 2. Search City ID from api.myquran.com
          const kotaRes = await fetch(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(searchKeyword)}`);
          const kotaData = await kotaRes.json();
          
          if (!kotaData.status || kotaData.data.length === 0) {
            throw new Error(`Kota "${searchKeyword}" tidak ditemukan di database.`);
          }
          
          const kotaId = kotaData.data[0].id;

          // 3. Get Jadwal Sholat for that City
          const targetDate = new Date();
          const year = targetDate.getFullYear();
          const month = String(targetDate.getMonth() + 1).padStart(2, '0');
          const day = String(targetDate.getDate()).padStart(2, '0');

          const jadwalRes = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${kotaId}/${year}/${month}/${day}`);
          const jadwalDataRes = await jadwalRes.json();

          if (!jadwalDataRes.status) {
            throw new Error('Gagal mengambil jadwal sholat untuk lokasi tersebut.');
          }

          setJadwalData(jadwalDataRes.data.jadwal);
          setLokasi(jadwalDataRes.data.lokasi);
          setDateStr(jadwalDataRes.data.jadwal.tanggal);
        } catch (err: any) {
          setErrorMsg(err.message || 'Terjadi kesalahan saat mengambil lokasi.');
        } finally {
          setIsLoadingGPS(false);
        }
      },
      (error) => {
        setIsLoadingGPS(false);
        setErrorMsg('Gagal mengakses lokasi. Pastikan izin GPS diberikan.');
      }
    );
  };

  const hasRequestedLoc = useRef(false);

  useEffect(() => {
    if (!hasRequestedLoc.current) {
      hasRequestedLoc.current = true;
      handleUseLocation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[80vh] py-12 md:py-20 px-4 md:px-6 max-w-[800px] mx-auto">
      <div className="text-center mb-10">
        <h1 className="bq-serif text-3xl md:text-5xl text-[var(--bq-paper-800)] mb-4 font-medium tracking-[-0.5px]">Jadwal Sholat</h1>
        <p className="text-[var(--bq-paper-500)] text-sm md:text-base flex items-center justify-center gap-2 mb-2">
          <Icon d={Icons.MapPin} size={16} />
          {lokasi}
        </p>
        <p className="text-[var(--bq-gold-500)] font-medium text-sm">
          {dateStr || 'Gagal memuat tanggal'}
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <Button 
          variant="outline" 
          onClick={handleUseLocation}
          disabled={isLoadingGPS}
          icon={isLoadingGPS ? undefined : Icons.MapPin}
          className="shadow-sm"
        >
          {isLoadingGPS ? 'Mencari Lokasi...' : 'Gunakan Lokasi Saat Ini'}
        </Button>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100 max-w-md mx-auto">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3">
        {PRAYER_TIMES.map((prayer) => (
          <Card key={prayer.name} className="p-5 md:p-8 text-center transition-all hover:border-[var(--bq-gold-300)]">
            <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-xl bg-[var(--bq-brown-50)] text-[var(--bq-brown-500)] flex items-center justify-center mb-4 md:mb-5">
              <Icon d={prayer.icon} size={20} className="md:w-[24px] md:h-[24px]" />
            </div>
            <h3 className="text-sm md:text-base font-semibold text-[var(--bq-paper-600)] mb-1">{prayer.name}</h3>
            <p className="text-xl md:text-3xl font-bold text-[var(--bq-paper-800)] bq-arabic">{prayer.time}</p>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs text-[var(--bq-paper-400)]">
          * Sumber data: api.myquran.com (Kemenag RI)
        </p>
      </div>
    </div>
  );
}
