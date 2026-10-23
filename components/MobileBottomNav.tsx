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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-200/80 md:hidden supports-[backdrop-filter]:bg-white/70">
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
                  group flex flex-col items-center justify-center flex-1 min-w-0 px-1 py-2 min-h-[52px] rounded-lg transition-colors duration-200
                  ${active
                    ? 'text-red-600'
                    : 'text-gray-500 active:text-red-600'
                  }
                `}
                aria-label={item.label}
              >
                <div className="relative">
                  <IconComponent
                    className="h-6 w-6 transition-opacity duration-200"
                  />
                </div>
                <span
                  className={`
                    text-[10px] font-medium mt-0.5 truncate w-full text-center leading-tight
                    ${active ? 'text-red-600 font-semibold' : 'text-gray-500'}
                  `}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

    </nav>
  )
}
