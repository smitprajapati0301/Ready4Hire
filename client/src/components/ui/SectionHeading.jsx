export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}) {
  const alignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`${alignments[align]} space-y-3`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
        {title}
      </h2>
      {description && <p className="text-slate-600">{description}</p>}
    </div>
  );
}
