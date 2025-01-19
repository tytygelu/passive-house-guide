// src/app/[lang]/layout.tsx
export default function LanguageLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <div className="flex flex-col min-h-screen">{children}</div>
  }