import React from 'react';
import { getJadwalSholat } from '@/infrastructure/api/sholatApi';
import { SholatClient } from './SholatClient';

export const metadata = {
  title: 'Jadwal Sholat - Qur-anan',
  description: 'Jadwal sholat hari ini',
};

export default async function SholatPage() {
  let jadwalData = null;
  let lokasi = 'Jakarta';
  let dateStr = '';
  
  try {
    const response = await getJadwalSholat('1301');
    jadwalData = response.data.jadwal;
    lokasi = response.data.lokasi;
    dateStr = response.data.jadwal.tanggal;
  } catch (error) {
    console.error('Failed to fetch jadwal sholat:', error);
  }

  return (
    <SholatClient 
      initialJadwal={jadwalData} 
      initialLokasi={lokasi} 
      initialDateStr={dateStr} 
    />
  );
}
