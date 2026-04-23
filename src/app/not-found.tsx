import Link from 'next/link';
import { Button } from '@/presentation/components/ui/Button';
import { Icon, Icons } from '@/presentation/components/icons';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[var(--bq-brown-50)] text-[var(--bq-brown-400)] flex items-center justify-center mb-6">
          <Icon d={Icons.Search} size={32} />
        </div>
        <h2 className="bq-serif text-3xl md:text-4xl text-[var(--bq-paper-800)] mb-3">Halaman Tidak Ditemukan</h2>
        <p className="text-[var(--bq-paper-500)] mb-8 max-w-md mx-auto">Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
        <Link href="/" className="no-underline">
          <Button variant="primary" icon={Icons.Home}>Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  );
}
