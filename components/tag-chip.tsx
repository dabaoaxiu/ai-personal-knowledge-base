import { cn } from "@/lib/utils";

interface TagChipProps {
  label: string;
  muted?: boolean;
}

export function TagChip({ label, muted = false }: TagChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
        muted
          ? "border-stone-200 bg-stone-100 text-stone-500"
          : "border-teal-200 bg-teal-50 text-teal-700"
      )}
    >
      #{label}
    </span>
  );
}
