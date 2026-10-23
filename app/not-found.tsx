import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="text-center max-w-md">
          <p className="text-6xl sm:text-7xl font-bold tracking-tight text-gray-900 mb-2">404</p>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Page not found</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed">
            The page you&apos;re looking for may have moved or doesn&apos;t exist. Explore our tours or
            get in touch—we&apos;re happy to help plan your Ghana journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary">
              Back to home
            </Link>
            <Link href="/tours" className="btn-secondary">
              Browse tours
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
