interface TagsProps {
  tags?: string[]
  className?: string
  lang: string
}

export default function Tags({ tags, className = '', lang }: TagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <a
          href={`/${lang}/search?tag=${encodeURIComponent(tag)}`}
          key={tag}
          className="inline-block px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          #{tag}
        </a>
      ))}
    </div>
  );
}
