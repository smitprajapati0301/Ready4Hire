export default function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/60 transition duration-500 hover:shadow-md hover:shadow-slate-300/50 ${className}`}
      {...props}
    />
  );
}
