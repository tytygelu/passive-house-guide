// src/types/page.ts
import { ReactNode } from 'react'

export type PageParams = {
  lang: string
  [key: string]: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type PageProps = {
  params: Promise<any>
}

export type LayoutProps = {
  children: ReactNode
  params: Promise<any>
}
/* eslint-enable @typescript-eslint/no-explicit-any */
