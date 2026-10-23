import { getSiteUrl } from '@/lib/site-url'

/** Minimal descriptor for AI agents (not an OpenAI Actions plugin). */
export function GET() {
  const site = getSiteUrl()

  const body = {
    schema_version: 'v1',
    name_for_human: 'Tourworld Tourism',
    name_for_model: 'tourworld_ghana_tours',
    description_for_human: 'Licensed Ghana tour operator — browse tours, hotels, galleries, and contact for bookings.',
    description_for_model:
      'Use public GET JSON endpoints and /llms.txt for Tourworld Tourism. Search tours via /tours?q= or /api/tours. Book via tour detail pages or contact info@tourworldtourism.com.',
    auth: { type: 'none' },
    api: {
      type: 'openapi',
      url: `${site}/api/agent-openapi.json`,
    },
    logo_url: `${site}/logo.png`,
    contact_email: 'info@tourworldtourism.com',
    legal_info_url: `${site}/about`,
    llms_txt: `${site}/llms.txt`,
  }

  return Response.json(body, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
