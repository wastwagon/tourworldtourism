export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }
  return 'https://tourworldtourism.com'
}
