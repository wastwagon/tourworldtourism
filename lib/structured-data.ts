import { getSiteUrl } from '@/lib/site-url'
import type { FaqItem } from '@/lib/faq-content'

const ORG_NAME = 'TOURWORLD TOURISM SERVICES LTD'

export function buildWebSiteJsonLd() {
  const siteUrl = getSiteUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tourworld Tourism',
    alternateName: ORG_NAME,
    url: siteUrl,
    inLanguage: 'en',
    publisher: {
      '@type': 'TravelAgency',
      name: ORG_NAME,
      url: siteUrl,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/tours?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function buildTravelAgencyJsonLd() {
  const siteUrl = getSiteUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: ORG_NAME,
    alternateName: 'Tourworld Tourism',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/logo.png`,
    telephone: '+233547783865',
    email: 'info@tourworldtourism.com',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'No. 44, Sixth Avenue, North Ridge',
        addressLocality: 'Accra',
        addressCountry: 'GH',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'No. 2 Ayeben Street, Adenta Housing Down',
        addressLocality: 'Adenta, Accra',
        addressCountry: 'GH',
      },
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Ghana',
    },
    sameAs: [
      'https://facebook.com/tourworldtourism',
      'https://instagram.com/tourworldtourism',
      'https://twitter.com/tourworldtourism',
      'https://youtube.com/tourworldtourism',
    ],
  }
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  const siteUrl = getSiteUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
    })),
  }
}

export function buildBlogPostingJsonLd(blog: {
  title: string
  slug: string
  excerpt: string
  author: string
  featuredImage: string | null
  publishedAt: Date | null
}) {
  const siteUrl = getSiteUrl()
  const url = `${siteUrl}/blog/${blog.slug}`
  const image = blog.featuredImage
    ? blog.featuredImage.startsWith('http')
      ? blog.featuredImage
      : `${siteUrl}${blog.featuredImage.startsWith('/') ? '' : '/'}${blog.featuredImage}`
    : `${siteUrl}/logo.png`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    url,
    image,
    author: {
      '@type': 'Organization',
      name: blog.author,
    },
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: blog.publishedAt?.toISOString(),
  }
}

export function buildTouristTripJsonLd(tour: {
  title: string
  slug: string
  description: string
  durationDays: number
  regions: string[]
  tourType: string
  pricePerPerson: number
  featuredImage: string | null
}) {
  const siteUrl = getSiteUrl()
  const tourUrl = `${siteUrl}/tours/${tour.slug}`
  const image = tour.featuredImage
    ? tour.featuredImage.startsWith('http')
      ? tour.featuredImage
      : `${siteUrl}${tour.featuredImage.startsWith('/') ? '' : '/'}${tour.featuredImage}`
    : `${siteUrl}/logo.png`

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.description,
    url: tourUrl,
    image,
    touristType: tour.tourType,
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: tour.durationDays,
      itemListElement: tour.regions.map((region, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: region,
      })),
    },
    provider: {
      '@type': 'TravelAgency',
      name: ORG_NAME,
      url: siteUrl,
      telephone: '+233547783865',
    },
    offers: {
      '@type': 'Offer',
      url: tourUrl,
      priceCurrency: 'USD',
      price: tour.pricePerPerson,
      availability: 'https://schema.org/InStock',
    },
  }
}
