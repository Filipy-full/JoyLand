import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function MyAdoptionsButton() {
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
      const { data } = await supabase
        .from('adoptions')
        .select('id')
        .eq('user_id', userData.user.id)
        .limit(1)
      setHasAdoptions(!!(data && data.length > 0))
      setLoading(false)
    }
    fetchAdoptions()
  }, [])

  if (loading || !hasAdoptions) return null
  return (
    <a
      href="/adopt/my-adoptions"
      className="absolute top-4 right-4 bg-sage-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-sage-700 transition-all z-30"
    >
      My Adoptions
    </a>
  )
}
