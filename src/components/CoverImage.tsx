import Image from 'next/image'

interface CoverImageProps {
  title: string
  src: string
  priority?: boolean
  className?: string
  sizes?: string
}

export function CoverImage({ 
  title, 
  src, 
  priority = false, 
  className = '',
  sizes = "(min-width: 1024px) 896px, 100vw"
}: CoverImageProps) {
  return (
    <div className={`relative aspect-video ${className}`}>
      <Image
        src={src || '/images/default-cover.jpg'}
        alt={`Cover image for ${title}`}
        fill
        sizes={sizes}
        className="object-cover rounded-lg"
        priority={priority}
      />
    </div>
  )
}
