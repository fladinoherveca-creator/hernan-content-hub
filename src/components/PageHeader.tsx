export function PageHeader({ title, subtitle }: { title: string; subtitle?: string | undefined }) {
  return (
    <section className="bg-primary-deep text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-semibold md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl opacity-80">{subtitle}</p>}
      </div>
    </section>
  );
}
