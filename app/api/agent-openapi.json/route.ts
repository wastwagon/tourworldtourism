import { getSiteUrl } from '@/lib/site-url'

export function GET() {
  const site = getSiteUrl()

  const spec = {
    openapi: '3.0.3',
    info: {
      title: 'Tourworld Tourism Public API',
      description:
        'Read-only endpoints for tour listings and content. Rate limit 120 req/min/IP. See /llms.txt.',
      version: '1.0.0',
    },
    servers: [{ url: site }],
    paths: {
      '/api/tours': {
        get: {
          summary: 'List active tours',
          parameters: [
            { name: 'featured', in: 'query', schema: { type: 'boolean' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
          ],
          responses: { '200': { description: 'Array of tour summaries' } },
        },
      },
      '/api/tours/{slug}': {
        get: {
          summary: 'Get one tour by slug',
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Tour detail' } },
        },
      },
      '/api/hotels': {
        get: { summary: 'List partner hotels', responses: { '200': { description: 'Hotel list' } } },
      },
      '/api/galleries': {
        get: {
          summary: 'List galleries or one by slug',
          parameters: [{ name: 'slug', in: 'query', schema: { type: 'string' } }],
          responses: { '200': { description: 'Galleries' } },
        },
      },
      '/api/blogs': {
        get: { summary: 'Published blog posts', responses: { '200': { description: 'Blog list' } } },
      },
      '/api/testimonials': {
        get: { summary: 'Approved testimonials', responses: { '200': { description: 'Testimonials' } } },
      },
    },
  }

  return Response.json(spec, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
