export default function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white/80">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="text-xs text-white/70">{label}</p>
    </div>
  );
}
