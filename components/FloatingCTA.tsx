'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function FloatingCTA() {
  const pathname = usePathname()
  
  // Don't show on adopt pages or success page
  if (pathname?.includes('/adopt') || pathname?.includes('/tree/')) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <Link
        href="/adopt"
        className="flex items-center gap-2 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all font-bold text-lg hover:scale-105"
      >
        <span>🌿</span>
        <span>ADOPTAR AHORA</span>
      </Link>
    </div>
  )
}
