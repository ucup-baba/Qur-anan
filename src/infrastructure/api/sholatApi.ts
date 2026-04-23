export interface SholatJadwal {
  tanggal: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  date: string;
}

export interface SholatResponse {
  status: boolean;
  request: {
    path: string;
  };
  data: {
    id: number;
    lokasi: string;
    daerah: string;
    jadwal: SholatJadwal;
  };
}

export async function getJadwalSholat(kotaId: string = '1301', date?: Date): Promise<SholatResponse> {
  const targetDate = date || new Date();
  // Ensure the date formatting handles local time properly, but using simple UTC/local is fine for simple daily fetch
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');

  const url = `https://api.myquran.com/v2/sholat/jadwal/${kotaId}/${year}/${month}/${day}`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
  if (!res.ok) {
    throw new Error('Gagal mengambil jadwal sholat');
  }
  
  return res.json();
}
