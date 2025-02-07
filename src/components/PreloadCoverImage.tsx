interface PreloadCoverImageProps {
  coverImage?: string;
}

export default function PreloadCoverImage({ coverImage }: PreloadCoverImageProps) {
  if (!coverImage) return null;
  // Preload link removed because Next.js Image component handles image preloading when using the 'priority' prop
  return null;
}
