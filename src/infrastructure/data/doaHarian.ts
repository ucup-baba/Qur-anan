export interface Doa {
  id: string;
  kategori: string;
  judul: string;
  arab: string;
  latin: string;
  arti: string;
}

export const doaHarian: Doa[] = [
  {
    id: 'sebelum-tidur',
    kategori: 'Tidur',
    judul: 'Doa Sebelum Tidur',
    arab: 'بِاسْمِكَ اللَّهُمَّ أَحْيَا وَأَمُوْتُ',
    latin: "Bismika Allahumma ahya wa amut.",
    arti: 'Dengan nama-Mu ya Allah aku hidup dan aku mati.',
  },
  {
    id: 'bangun-tidur',
    kategori: 'Tidur',
    judul: 'Doa Bangun Tidur',
    arab: 'اَلْحَمْدُ لِلَّهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ',
    latin: "Alhamdulillahilladzi ahyana ba'da ma amatana wa ilaihin nusyur.",
    arti: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami dikembalikan.',
  },
  {
    id: 'sebelum-makan',
    kategori: 'Makan',
    judul: 'Doa Sebelum Makan',
    arab: 'اَللَّهُمَّ بَارِكْ لَنَا فِيْمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    latin: "Allahumma barik lana fima razaqtana wa qina 'adzaban naar.",
    arti: 'Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami, dan lindungilah kami dari siksa api neraka.',
  },
  {
    id: 'sesudah-makan',
    kategori: 'Makan',
    judul: 'Doa Sesudah Makan',
    arab: 'اَلْحَمْدُ لِلَّهِ الَّذِيْ أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ',
    latin: "Alhamdulillahilladzi ath'amana wa saqana wa ja'alana muslimin.",
    arti: 'Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami orang-orang Islam.',
  },
  {
    id: 'masuk-kamar-mandi',
    kategori: 'Keseharian',
    judul: 'Doa Masuk Kamar Mandi',
    arab: 'اَللَّهُمَّ إِنِّيْ أَعُوْذُبِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    latin: "Allahumma inni a'udzubika minal khubutsi wal khabaits.",
    arti: 'Ya Allah, aku berlindung kepada-Mu dari godaan setan laki-laki dan perempuan.',
  },
  {
    id: 'keluar-kamar-mandi',
    kategori: 'Keseharian',
    judul: 'Doa Keluar Kamar Mandi',
    arab: 'غُفْرَانَكَ الْحَمْدُ لِلَّهِ الَّذِيْ أَذْهَبَ عَنِّى اْلأَذَى وَعَافَانِيْ',
    latin: "Ghufranaka, alhamdulillahilladzi adzhaba 'annil adza wa 'afani.",
    arti: 'Dengan mengharap ampunan-Mu, segala puji bagi Allah yang telah menghilangkan kotoran dariku dan menyehatkanku.',
  },
  {
    id: 'keluar-rumah',
    kategori: 'Perjalanan',
    judul: 'Doa Keluar Rumah',
    arab: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ',
    latin: "Bismillahi tawakkaltu 'alallah, wa la haula wa la quwwata illa billah.",
    arti: 'Dengan nama Allah, aku bertawakal kepada Allah, tiada daya dan kekuatan kecuali dengan (pertolongan) Allah.',
  },
  {
    id: 'masuk-rumah',
    kategori: 'Perjalanan',
    judul: 'Doa Masuk Rumah',
    arab: 'اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبَّنَا تَوَكَّلْنَا',
    latin: "Allahumma inni as-aluka khairal mauliji wa khairal makhraji, bismillahi walajna wa bismillahi kharajna wa 'alallahi rabbina tawakkalna.",
    arti: 'Ya Allah, aku mohon kepada-Mu tempat masuk yang baik dan tempat keluar yang baik. Dengan nama Allah kami masuk dan dengan nama Allah kami keluar, dan kepada Allah Tuhan kami, kami bertawakal.',
  },
  {
    id: 'sebelum-belajar',
    kategori: 'Belajar',
    judul: 'Doa Sebelum Belajar',
    arab: 'رَبِّ زِدْنِيْ عِلْمًا وَارْزُقْنِيْ فَهْمًا',
    latin: "Rabbi zidni 'ilman warzuqni fahman.",
    arti: 'Ya Tuhanku, tambahkanlah ilmu kepadaku, dan berilah aku karunia berupa pemahaman.',
  },
  {
    id: 'kedua-orangtua',
    kategori: 'Keluarga',
    judul: 'Doa untuk Kedua Orang Tua',
    arab: 'رَبِّ اغْفِرْ لِيْ وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِيْ صَغِيْرًا',
    latin: "Rabbighfir li wa li walidayya warhamhuma kama rabbayani shaghira.",
    arti: 'Ya Tuhanku, ampunilah aku dan kedua orang tuaku, sayangilah mereka sebagaimana mereka menyayangiku di waktu kecil.',
  },
  {
    id: 'kebaikan-dunia-akhirat',
    kategori: 'Umum',
    judul: 'Doa Sapu Jagat',
    arab: 'رَبَّنَا آتِنَا فِى الدُّنْيَا حَسَنَةً وَفِى الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: "Rabbana atina fid dunya hasanah, wa fil akhirati hasanah, wa qina 'adzaban naar.",
    arti: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari siksa api neraka.',
  },
  {
    id: 'naik-kendaraan',
    kategori: 'Perjalanan',
    judul: 'Doa Naik Kendaraan',
    arab: 'سُبْحَانَ الَّذِيْ سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِيْنَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُوْنَ',
    latin: "Subhanalladzi sakhkhara lana hadza wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun.",
    arti: 'Maha Suci Allah yang telah menundukkan (kendaraan) ini bagi kami, padahal kami tidak mampu menguasainya. Sesungguhnya kami akan kembali kepada Tuhan kami.',
  },
];

export function groupByKategori(doa: Doa[]): Record<string, Doa[]> {
  return doa.reduce<Record<string, Doa[]>>((acc, d) => {
    (acc[d.kategori] ||= []).push(d);
    return acc;
  }, {});
}
