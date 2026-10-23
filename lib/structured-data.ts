import { getSiteUrl } from '@/lib/site-url'

const ORG_NAME = 'TOURWORLD TOURISM SERVICES LTD'

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
