import React from 'react';
import Link from 'next/link';
import { Icons, Icon } from '@/presentation/components/icons';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[var(--bq-paper-100)] pt-20 pb-24 px-6">
      <div className="max-w-[800px] mx-auto">
        <Link href="/profile" className="inline-flex items-center text-[var(--bq-paper-600)] hover:text-[var(--bq-brown-500)] mb-6 transition-colors no-underline">
          <Icon d={Icons.ChevronLeft} size={20} className="mr-1" />
          <span className="text-sm font-medium">Kembali</span>
        </Link>
        
        <h1 className="text-3xl font-bold text-[var(--bq-paper-800)] mb-6">Syarat dan Ketentuan</h1>
        
        <div className="prose prose-sm sm:prose-base text-[var(--bq-paper-700)] bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[var(--bq-paper-200)]">
          <p className="mb-4">Terakhir diperbarui: 26 April 2026</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">1. Penerimaan Syarat</h2>
          <p className="mb-4">
            Dengan mengakses dan menggunakan aplikasi Qur-anan, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak diperkenankan untuk menggunakan aplikasi ini.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">2. Penggunaan Layanan</h2>
          <p className="mb-2">Aplikasi Qur-anan disediakan untuk tujuan ibadah, pendidikan, dan referensi pribadi. Pengguna setuju untuk:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Tidak menyalahgunakan layanan kami untuk aktivitas ilegal.</li>
            <li>Tidak mencoba merusak, menonaktifkan, atau memberikan beban berlebih pada sistem dan server aplikasi.</li>
            <li>Menggunakan konten (seperti teks Al-Qur'an, audio, dan video kajian) sesuai dengan tujuannya dengan penuh rasa hormat.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">3. Akun Pengguna</h2>
          <p className="mb-4">
            Untuk mengakses beberapa fitur (seperti menyimpan penanda ayat atau mengakses video kajian tertentu), Anda mungkin perlu masuk menggunakan Akun Google. Anda bertanggung jawab untuk menjaga keamanan akun Anda dan semua aktivitas yang terjadi di bawah akun Anda.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">4. Layanan Pihak Ketiga</h2>
          <p className="mb-4">
            Aplikasi kami menggunakan layanan pihak ketiga, termasuk Google Authentication dan YouTube API, untuk menyediakan fungsionalitas tertentu. Penggunaan layanan tersebut juga tunduk pada Ketentuan Layanan masing-masing pihak ketiga. Kami tidak bertanggung jawab atas isi atau ketersediaan layanan pihak ketiga tersebut.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">5. Hak Kekayaan Intelektual</h2>
          <p className="mb-4">
            Seluruh konten, desain, antarmuka, dan struktur aplikasi adalah milik pengembang Qur-anan atau pihak ketiga yang melisensikannya. Teks Al-Qur'an dan terjemahan disediakan secara gratis untuk ummat melalui API publik. Video kajian adalah milik channel YouTube Yayasan Baitul Qowwam.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">6. Batasan Tanggung Jawab</h2>
          <p className="mb-4">
            Kami berusaha menjaga akurasi teks Al-Qur'an, jadwal sholat, dan arah kiblat sebaik mungkin. Namun, kami tidak menjamin bahwa aplikasi ini 100% bebas dari kesalahan. Pengguna disarankan untuk melakukan pengecekan ganda pada jadwal sholat dan arah kiblat dengan sumber resmi jika diperlukan. Kami tidak bertanggung jawab atas kerugian langsung atau tidak langsung yang timbul dari penggunaan aplikasi ini.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">7. Modifikasi Layanan</h2>
          <p className="mb-4">
            Kami berhak untuk memodifikasi atau menghentikan sementara atau selamanya layanan aplikasi ini (atau bagian darinya) dengan atau tanpa pemberitahuan.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">8. Hukum yang Berlaku</h2>
          <p className="mb-4">
            Syarat dan ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Indonesia.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">9. Hubungi Kami</h2>
          <p className="mb-4">
            Jika Anda memiliki pertanyaan mengenai Syarat dan Ketentuan ini, silakan hubungi tim developer kami melalui email di:{' '}
            <a href="mailto:patrabq.group@gmail.com" className="text-[var(--bq-gold-500)] hover:text-[var(--bq-brown-500)] underline font-medium transition-colors">
              patrabq.group@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
