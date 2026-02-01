'use client'

import { Suspense } from 'react'
import DashboardClient from '@/components/DashboardClient'

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    }>
      <DashboardClient />
    </Suspense>
  )
}
