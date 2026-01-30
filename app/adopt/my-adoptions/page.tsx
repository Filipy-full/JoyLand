"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function MyAdoptionsPage() {
  const [adoptions, setAdoptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAdoptions = async () => {
      setLoading(true)
      setError('')
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        setError('You must be logged in to see your adoptions.')
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('adoptions')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })
      if (error) setError(error.message)
      else setAdoptions(data || [])
      setLoading(false)
    }
    fetchAdoptions()
  }, [])

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">My Adoptions</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <ul className="space-y-6">
        {adoptions.map(adopt => (
          <li key={adopt.id} className="border rounded p-4 bg-white">
            <div><b>Tree ID:</b> {adopt.tree_id}</div>
            <div><b>Name:</b> {adopt.user_name}</div>
            <div><b>Email:</b> {adopt.user_email}</div>
            <div className="text-xs text-gray-500 mt-2">{new Date(adopt.created_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
