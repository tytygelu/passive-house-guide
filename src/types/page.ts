// src/types/page.ts
import { ReactNode } from 'react';

export type PageParams = {
  lang: string
  [key: string]: string
}

export type PageProps = {
  params: Promise<any>
}

export type LayoutProps = {
  children: ReactNode
  params: Promise<any>
}
