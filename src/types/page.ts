// src/types/page.ts
import { ReactNode } from 'react'

export type PageParams = {
  lang: string
}

export type PageProps = {
  params: PageParams
}

export type LayoutProps = {
  children: ReactNode
  params: PageParams
}
