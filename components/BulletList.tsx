// components/BulletList.tsx
// Renders any string array as a clean bullet list.
// Reused for Pros, Cons, Risks, and Opportunities — same shape, different data.

export default function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-gray-600 text-sm italic">None identified.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="text-gray-300 text-sm flex gap-2">
          <span className="text-gray-600 mt-0.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}