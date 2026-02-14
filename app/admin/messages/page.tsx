
"use client"
import { useEffect, useState } from 'react'

type Message = {
  id: string;
  name?: string;
  user_name?: string;
  email: string;
  message: string;
  created_at: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selected, setSelected] = useState<Message | null>(null)
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/admin/messages', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`
          }
        })
        const data = await res.json()
        if (data.messages) setMessages(data.messages)
        else setError(data.error || 'Error fetching messages')
      } catch (err) {
        setError('Error fetching messages')
      }
      setLoading(false)
    }
    fetchMessages()
  }, [])

  async function sendReply() {
    if (!selected) return
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      // Simular guardado de respuesta solo en el frontend
      setSuccess('Respuesta guardada correctamente (solo en el sitio, no se envió email)')
      setReply('')
    } catch (err) {
      setError('Error al guardar respuesta')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-2 sm:px-0">
      <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>
      {loading && <p className="text-sage-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Received Messages</h2>
          <ul className="divide-y">
            {messages.map(msg => (
              <li key={msg.id} className={`py-3 cursor-pointer ${selected?.id === msg.id ? 'bg-sage-100' : ''}`} onClick={() => setSelected(msg)}>
                <div className="font-bold">{msg.name || msg.user_name || 'User'} &lt;{msg.email}&gt;</div>
                <div className="text-sage-700 text-sm">{msg.message?.slice(0, 80)}...</div>
                <div className="text-xs text-sage-400">{new Date(msg.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          {selected ? (
            <div>
              <h2 className="text-xl font-semibold mb-2">Reply to {selected.name || selected.user_name || 'User'}</h2>
              <div className="mb-2 p-2 bg-sage-50 rounded">{selected.message}</div>
              <textarea
                className="w-full border rounded p-2 mb-2"
                rows={6}
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Write your reply here..."
              />
              <button
                className="bg-sage-600 text-white px-4 py-2 rounded hover:bg-sage-700"
                onClick={sendReply}
                disabled={loading || !reply.trim()}
              >Send reply</button>
            </div>
          ) : (
            <div className="text-sage-500">Select a message to reply</div>
          )}
        </div>
      </div>
    </div>
  )
}
