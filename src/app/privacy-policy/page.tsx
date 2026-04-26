import React from 'react';
import Link from 'next/link';
import { Icons, Icon } from '@/presentation/components/icons';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--bq-paper-100)] pt-20 pb-24 px-6">
      <div className="max-w-[800px] mx-auto">
        <Link href="/profile" className="inline-flex items-center text-[var(--bq-paper-600)] hover:text-[var(--bq-brown-500)] mb-6 transition-colors no-underline">
          <Icon d={Icons.ChevronLeft} size={20} className="mr-1" />
          <span className="text-sm font-medium">Kembali</span>
        </Link>
        
        <h1 className="text-3xl font-bold text-[var(--bq-paper-800)] mb-6">Kebijakan Privasi</h1>
        
        <div className="prose prose-sm sm:prose-base text-[var(--bq-paper-700)] bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[var(--bq-paper-200)]">
          <p className="mb-4">Terakhir diperbarui: 26 April 2026</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">1. Pendahuluan</h2>
          <p className="mb-4">
            Selamat datang di aplikasi Qur-anan. Kami menghargai privasi Anda dan berkomitmen untuk melindungi informasi pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda saat menggunakan layanan kami.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">2. Informasi yang Kami Kumpulkan</h2>
          <p className="mb-2">Saat Anda menggunakan Qur-anan dan masuk menggunakan akun Google Anda, kami mengumpulkan informasi berikut:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Informasi Profil Dasar:</strong> Nama lengkap, alamat email, dan foto profil yang terkait dengan akun Google Anda.</li>
            <li><strong>Status Langganan YouTube:</strong> (Hanya jika Anda memberikan izin) Kami memeriksa status langganan Anda ke channel Yayasan Baitul Qowwam melalui YouTube Data API v3 untuk memberikan fitur khusus (seperti membuka konten kajian). Kami memiliki akses 'read-only' dan tidak dapat melakukan tindakan apa pun pada akun YouTube Anda.</li>
            <li><strong>Preferensi Aplikasi:</strong> Riwayat bacaan Al-Qur'an, pengaturan audio, dan penanda ayat yang Anda simpan di aplikasi kami.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">3. Bagaimana Kami Menggunakan Informasi Anda</h2>
          <p className="mb-2">Kami menggunakan informasi yang dikumpulkan untuk:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Mempersonalisasi pengalaman Anda menggunakan aplikasi.</li>
            <li>Menyimpan progres bacaan dan pengaturan Anda lintas perangkat.</li>
            <li>Memverifikasi akses Anda terhadap konten premium/khusus di program Kajian.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">4. Perlindungan Data</h2>
          <p className="mb-4">
            Keamanan data Anda sangat penting bagi kami. Kami tidak menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga mana pun tanpa persetujuan Anda, kecuali diwajibkan oleh hukum. Data autentikasi dan status langganan dikelola secara aman menggunakan Firebase Authentication.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">5. Menghapus Data Anda</h2>
          <p className="mb-4">
            Jika Anda ingin menghapus akun Anda dan semua data yang terkait dari server kami, Anda dapat keluar dari akun (Sign Out) melalui menu Profil, atau mencabut akses aplikasi dari pengaturan akun Google Anda. Anda juga dapat menghubungi tim dukungan kami untuk permintaan penghapusan data secara penuh.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">6. Perubahan Kebijakan</h2>
          <p className="mb-4">
            Kami mungkin memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan signifikan melalui pembaruan di aplikasi.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-[var(--bq-paper-800)]">7. Hubungi Kami</h2>
          <p className="mb-4">
            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin mengajukan permohonan terkait data Anda, silakan hubungi tim developer kami melalui email di:{' '}
            <a href="mailto:patrabq.group@gmail.com" className="text-[var(--bq-gold-500)] hover:text-[var(--bq-brown-500)] underline font-medium transition-colors">
              patrabq.group@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
