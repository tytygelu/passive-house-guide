import type { MDXComponents } from 'mdx/types'
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-4xl font-bold mb-6">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold mb-4 mt-8">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold mb-3 mt-6">{children}</h3>,
    p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-gray-700">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-700">{children}</ol>,
    li: ({ children }) => <li className="mb-2">{children}</li>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    ...components,
  }
}
