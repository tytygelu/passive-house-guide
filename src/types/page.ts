// src/types/page.ts
import { ReactNode } from 'react'

export type PageParams = {
  lang: string
  [key: string]: string
}

export type PageProps = {
  params: PageParams | Promise<PageParams>
}

export type LayoutProps = {
  children: ReactNode
  params: PageParams | Promise<PageParams>
}
