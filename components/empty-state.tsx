interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-stone-300 bg-white/70 p-10 text-center shadow-soft">
      <h3 className="font-serif text-2xl text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-stone-600">{description}</p>
    </div>
  );
}
