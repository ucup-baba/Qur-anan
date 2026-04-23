export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 rounded-full border-4 border-[var(--bq-paper-200)] border-t-[var(--bq-gold-400)] animate-spin mb-4" />
      <p className="text-[var(--bq-paper-500)] font-medium tracking-wide">Memuat...</p>
    </div>
  );
}
