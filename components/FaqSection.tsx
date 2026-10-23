import { JsonLd } from '@/components/JsonLd'
import { buildFaqJsonLd } from '@/lib/structured-data'
import type { FaqItem } from '@/lib/faq-content'

type FaqSectionProps = {
  title: string
  items: FaqItem[]
  className?: string
}

export function FaqSection({ title, items, className = '' }: FaqSectionProps) {
  if (items.length === 0) return null

  const headingId = `faq-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

  return (
    <section className={className} aria-labelledby={headingId}>
      <JsonLd data={buildFaqJsonLd(items)} />
      <h2 id={headingId} className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        {title}
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <details
            key={item.question}
            className="surface-card p-4 sm:p-5 group"
          >
            <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-start justify-between gap-3 min-h-[44px]">
              <span>{item.question}</span>
              <span className="text-red-600 text-sm flex-shrink-0 group-open:rotate-45 transition-transform" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
