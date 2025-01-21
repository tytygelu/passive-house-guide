// src/types/page.ts
import { ReactNode } from 'react'

export type PageProps = {
  params: Promise<{ lang: string }>
}

export type LayoutProps = {
  children: ReactNode
  params: Promise<{ lang: string }>
}
