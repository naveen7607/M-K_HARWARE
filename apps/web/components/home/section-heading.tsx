export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-wide text-secondary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}
