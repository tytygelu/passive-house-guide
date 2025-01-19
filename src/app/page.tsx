// src/app/page.tsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirecționăm către limba implicită (en)
  redirect('/en')
}