import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'
import { JsonLd } from '@/components/JsonLd'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'

export type BreadcrumbItem = {
  name: string
  href?: string
}

type PageBreadcrumbsProps = {
  items: BreadcrumbItem[]
  className?: string
}

export function PageBreadcrumbs({ items, className = '' }: PageBreadcrumbsProps) {
  const jsonItems = items
    .filter((item) => item.href)
    .map((item) => ({ name: item.name, path: item.href! }))

  return (
    <>
      {jsonItems.length > 0 && <JsonLd data={buildBreadcrumbJsonLd(jsonItems)} />}
      <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
        <ol className="flex flex-wrap items-center gap-1 text-gray-500">
          <li>
            <Link
              href="/"
              className="inline-flex items-center min-h-[36px] px-1 rounded-md hover:text-red-600 transition-colors"
            >
              <HomeIcon className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={`${item.name}-${index}`} className="flex items-center gap-1">
              <ChevronRightIcon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
              {item.href && index < items.length - 1 ? (
                <Link
                  href={item.href}
                  className="min-h-[36px] inline-flex items-center px-1 rounded-md hover:text-red-600 transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="min-h-[36px] inline-flex items-center px-1 text-gray-800 font-medium truncate max-w-[14rem] sm:max-w-none">
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
