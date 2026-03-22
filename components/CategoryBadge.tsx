import { CATEGORY_META, CategoryKey } from "@/lib/types";

export default function CategoryBadge({ category }: { category: string }) {
  const meta = CATEGORY_META[category as CategoryKey];
  if (!meta) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${meta.color}`}
    >
      {meta.emoji} {meta.label}
    </span>
  );
}
