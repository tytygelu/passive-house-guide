// src/app/page.tsx
import { redirect } from 'next/navigation'

export default function Home() {
  // Redirecționăm către limba implicită (en)
  redirect('/en/principles')
}