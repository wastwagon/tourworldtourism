import { getSiteUrl } from '@/lib/site-url'

export function buildLlmsTxt(): string {
  const site = getSiteUrl()

  return `# Tourworld Tourism (TOURWORLD TOURISM SERVICES LTD)
> Licensed Ghana tour operator — cultural, heritage, wildlife, and custom tours since 2015.

## Canonical site
- ${site}

## Primary pages
- Home: ${site}/
- Tours (search & filter): ${site}/tours
- Tour detail: ${site}/tours/{slug}
- Hotels: ${site}/hotels
- Gallery: ${site}/gallery
- Blog: ${site}/blog
- Testimonials: ${site}/testimonials
- About: ${site}/about
- Contact: ${site}/contact

## Tour search (for agents)
- Keyword: ${site}/tours?q={query}
- By type: ${site}/tours?type={tourType}
- By region: ${site}/tours?region={region}
- Examples: ${site}/tours?type=Culture%20%26%20Heritage | ${site}/tours?region=Greater%20Accra

## Public read APIs (JSON, GET, no auth)
- Rate limit: 120 requests per minute per IP (HTTP 429 when exceeded)
- List active tours: ${site}/api/tours
- Featured tours: ${site}/api/tours?featured=true&limit=10
- Single tour by slug: ${site}/api/tours/{slug}
- Hotels: ${site}/api/hotels
- Galleries: ${site}/api/galleries
- Gallery by slug: ${site}/api/galleries?slug={slug}
- Published blogs: ${site}/api/blogs
- Approved testimonials: ${site}/api/testimonials

## Booking & contact
- Phone: +233547783865
- Email: info@tourworldtourism.com
- WhatsApp: https://wa.me/233547783865
- Offices: North Ridge Accra (GPS GA-016-7761); Adenta Accra (GPS GD-040-1884)

## Structured data
- JSON-LD: TravelAgency, WebSite with SearchAction, TouristTrip on tour pages, BlogPosting, FAQPage, BreadcrumbList
- Sitemap: ${site}/sitemap.xml
- Robots: ${site}/robots.txt
- Agent descriptor: ${site}/.well-known/ai-plugin.json
- OpenAPI (public read): ${site}/api/agent-openapi.json

## Do not crawl
- ${site}/admin/
- ${site}/api/ (except public GET endpoints listed above for factual queries)

## Site credit
- Designed & developed by OceanCyber: https://oceancyber.net/
`
}
