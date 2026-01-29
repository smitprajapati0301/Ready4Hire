const base = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]";

const variants = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20",
  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20",
  outline:
    "border border-slate-200 text-slate-700 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50",
  ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-base",
};

export default function Button({
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
