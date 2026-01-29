const variants = {
  solid: "bg-indigo-600 text-white",
  soft: "bg-indigo-100 text-indigo-700",
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
};

export default function Badge({ className = "", variant = "soft", ...props }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
