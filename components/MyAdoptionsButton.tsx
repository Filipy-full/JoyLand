import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type MyAdoptionsButtonProps = {
  className?: string
}

export function MyAdoptionsButton({ className }: MyAdoptionsButtonProps) {
  const [hasAdoptions, setHasAdoptions] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdoptions = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        setHasAdoptions(false)
        setLoading(false)
        return
      }
      const userId = userData.user.id;
      const userEmail = userData.user.email;
      // ...existing code...
      const { data, error } = await supabase
        .from('adoptions')
        .select('id')
        .or(`user_id.eq.${userId},user_email.eq.${userEmail}`)
        .limit(1)
      // ...existing code...
      setHasAdoptions(!!(data && data.length > 0))
      setLoading(false)
    }
    fetchAdoptions()
  }, [])

  if (loading || !hasAdoptions) return null
  const classes = className
    ? className
    : 'absolute top-4 right-4 bg-sage-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-sage-700 transition-all z-30'

  return (
    <a href="/dashboard" className={classes}>
      My Tree
    </a>
  )
}
