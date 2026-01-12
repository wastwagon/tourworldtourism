'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  MapIcon,
  BuildingOfficeIcon,
  PhotoIcon,
  PhoneIcon,
} from '@heroicons/react/24/solid'
import {
  HomeIcon as HomeIconOutline,
  MapIcon as MapIconOutline,
  BuildingOfficeIcon as BuildingOfficeIconOutline,
  PhotoIcon as PhotoIconOutline,
  PhoneIcon as PhoneIconOutline,
} from '@heroicons/react/24/outline'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  iconOutline: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: HomeIcon,
    iconOutline: HomeIconOutline,
  },
  {
    href: '/tours',
    label: 'Tours',
    icon: MapIcon,
    iconOutline: MapIconOutline,
  },
  {
    href: '/hotels',
    label: 'Hotels',
    icon: BuildingOfficeIcon,
    iconOutline: BuildingOfficeIconOutline,
  },
  {
    href: '/gallery',
    label: 'Gallery',
    icon: PhotoIcon,
    iconOutline: PhotoIconOutline,
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: PhoneIcon,
    iconOutline: PhoneIconOutline,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl md:hidden">
      {/* Safe area padding for iOS devices */}
      <div className="pb-safe-area-inset-bottom">
        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const IconComponent = active ? item.icon : item.iconOutline

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex flex-col items-center justify-center flex-1 min-w-0 px-1 py-2 rounded-xl transition-all duration-300
                  ${active
                    ? 'text-red-600 bg-gradient-to-b from-red-50 to-red-100 scale-105 shadow-sm'
                    : 'text-gray-600 hover:text-red-600 hover:bg-gray-50 active:scale-95'
                  }
                `}
                aria-label={item.label}
              >
                <div className="relative">
                  <IconComponent
                    className={`
                      h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300
                      ${active ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-105'}
                    `}
                  />
                  {active && (
                    <>
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-600 rounded-full animate-pulse"></span>
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-400 rounded-full animate-ping"></span>
                    </>
                  )}
                </div>
                <span
                  className={`
                    text-[9px] sm:text-[10px] font-semibold mt-0.5 transition-all duration-300 truncate w-full text-center leading-tight
                    ${active ? 'text-red-600 font-bold' : 'text-gray-600 group-hover:text-red-600'}
                  `}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent"></div>
    </nav>
  )
}
