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
      // Permitir acceso a varios correos de admin
      const allowedAdmins = ['filipyhenrique54@gmail.com', 'joylandspain@gmail.com']
      if (user.email && allowedAdmins.includes(user.email)) {
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
