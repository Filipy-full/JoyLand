"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login')
        return
      }
      // Permitir solo el correo del admin
      if (user.email === 'filipyhenrique54@gmail.com') {
        setIsAdmin(true)
      } else {
        router.replace('/')
      }
      setLoading(false)
    }
    checkAdmin()
  }, [router])

  if (loading) return <div className="text-center py-12">Checking permissions...</div>
  if (!isAdmin) return null
  return <>{children}</>
}
