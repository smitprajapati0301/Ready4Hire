export default function Panel({ title, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
      <div className="mt-3 space-y-3 text-sm text-slate-600">{children}</div>
    </div>
  );
}
