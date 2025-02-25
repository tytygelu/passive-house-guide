'use client'

import { useRef, useEffect } from 'react'

type AdUnitProps = {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  responsive?: boolean
  style?: React.CSSProperties
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdUnit({ slot = '1379423050', format = 'auto', responsive = true, style }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (adRef.current && adRef.current.childElementCount === 0) {
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <div className="ad-container my-4" style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          ...(responsive ? { width: '100%' } : {}),
        }}
        data-ad-client="ca-pub-4195148067095287"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
        data-adtest="on"
      />
    </div>
  )
}
