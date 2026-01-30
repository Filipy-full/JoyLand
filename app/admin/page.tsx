"use client"

import { useEffect, useState } from 'react'
import AdminAuth from '@/components/AdminAuth'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
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
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) setError(error.message)
      else setMessages(data || [])
      setLoading(false)
    }
    fetchMessages()
  }, [])

  return (
    <AdminAuth>
      <div className="max-w-4xl mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button onClick={handleLogout} className="bg-sage-600 text-white px-4 py-2 rounded hover:bg-sage-700 transition-colors text-sm">Logout</button>
        </div>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Contact Messages</h2>
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
                <div className="mt-2">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Contact from JoyLand')}`}
                    className="inline-block bg-sage-600 text-white px-4 py-2 rounded hover:bg-sage-700 transition-colors text-sm"
                  >
                    Responder
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
        {/* Aquí puedes agregar más secciones para el admin en el futuro */}
      </div>
    </AdminAuth>
  )
}
