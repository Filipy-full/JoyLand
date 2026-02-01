
"use client"
import { useEffect, useState } from 'react'
import AdminAuth from '@/components/AdminAuth'


import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      setError('')
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token

      if (!token) {
        setError('No autorizado')
        setLoading(false)
        return
      }

      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error || 'Error al cargar mensajes')
        setLoading(false)
        return
      }

      const body = await res.json()
      setMessages(body.messages || [])
      setLoading(false)
    }
    fetchMessages()
  }, [])

  return (
    <AdminAuth>
      <div className="max-w-3xl mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <button onClick={handleLogout} className="bg-sage-600 text-white px-4 py-2 rounded hover:bg-sage-700 transition-colors text-sm">Logout</button>
        </div>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        <ul className="space-y-6">
          {messages.map(msg => (
            <li key={msg.id} className="border rounded p-4 bg-white">
              <div><b>Name:</b> {msg.name}</div>
              <div><b>Email:</b> {msg.email}</div>
              <div><b>Subject:</b> {msg.subject}</div>
              <div><b>Message:</b> {msg.message}</div>
              <div className="text-xs text-gray-500 mt-2">{new Date(msg.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </AdminAuth>
  )
}
