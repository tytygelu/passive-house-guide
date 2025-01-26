'use client'

import { useEffect } from 'react'

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

export default function AdUnit({ slot, format = 'auto', responsive = true, style }: AdUnitProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('Error loading AdSense ad:', err)
    }
  }, [])

  return (
    <div className="ad-container my-4" style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          ...(responsive ? { width: '100%' } : {}),
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Înlocuiește cu codul tău de publisher
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  )
}
