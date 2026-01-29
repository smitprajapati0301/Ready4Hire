export default function IconBadge({ icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-slate-200/70 bg-white p-5 transition duration-500 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition duration-500 group-hover:scale-110 group-hover:rotate-6">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900 transition duration-300 group-hover:text-indigo-600">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 transition duration-300 group-hover:text-slate-700">{description}</p>
    </div>
  );
}
