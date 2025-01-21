// src/types/page.ts
import { ReactNode } from 'react'

export type PageParams = {
  lang: string
}

export type PageProps = {
  params: Promise<PageParams>
}

export type LayoutProps = {
  children: ReactNode
  params: Promise<PageParams>
}
