"use client"

import { useEffect, useState } from 'react'
import AdminAuth from '@/components/AdminAuth'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [messages, setMessages] = useState<any[]>([])
  const [adoptions, setAdoptions] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'messages' | 'adoptions' | 'reports'>('messages')
  const [reportForm, setReportForm] = useState({
    adoptionId: '',
    userId: '',
    treeId: '',
    title: '',
    body: '',
  })
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const fetchMessages = async (token: string) => {
    setLoading(true)
    setError('')
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

  const fetchAdoptions = async (token: string) => {
    const res = await fetch('/api/admin/adoptions', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const body = await res.json()
      setAdoptions(body.adoptions || [])
    }
  }

  const fetchReports = async (token: string) => {
    const res = await fetch('/api/admin/reports', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const body = await res.json()
      setReports(body.reports || [])
    }
  }

  useEffect(() => {
    const loadAll = async () => {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
      if (!token) return
      await fetchMessages(token)
      await fetchAdoptions(token)
      await fetchReports(token)
    }
    loadAll()
  }, [])

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL messages? This action cannot be undone.')) return;
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
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error || 'Error al borrar mensajes')
    }
    await fetchMessages(token)
    setLoading(false)
  }

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (!token) {
      setError('No autorizado')
      return
    }

    const form = new FormData()
    form.append('adoption_id', reportForm.adoptionId)
    form.append('user_id', reportForm.userId)
    form.append('tree_id', reportForm.treeId)
    form.append('title', reportForm.title)
    form.append('body', reportForm.body)
    if (pdfFile) form.append('pdf', pdfFile)
    photoFiles.forEach((file) => form.append('photos', file))

    const res = await fetch('/api/admin/reports', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error || 'Error al crear reporte')
      return
    }

    setReportForm({ adoptionId: '', userId: '', treeId: '', title: '', body: '' })
    setPdfFile(null)
    setPhotoFiles([])
    await fetchReports(token)
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap gap-4 items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Gestión de mensajes, adopciones y reportes</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/admin/messages"
                className="bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors text-sm font-semibold"
              >
                Messages
              </a>
              <button
                onClick={handleLogout}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500">Messages</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500">Adoptions</p>
              <p className="text-2xl font-bold text-gray-900">{adoptions.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500">Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-2 mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setTab('messages')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === 'messages' ? 'bg-sage-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Messages
            </button>
            <button
              onClick={() => setTab('adoptions')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === 'adoptions' ? 'bg-sage-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Adoptions
            </button>
            <button
              onClick={() => setTab('reports')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === 'reports' ? 'bg-sage-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Reports
            </button>
          </div>

          {error && <div className="text-red-600 mb-4">{error}</div>}

          {tab === 'messages' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Contact Messages</h2>
                <button
                  onClick={handleDeleteAll}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                  disabled={loading || messages.length === 0}
                >
                  Delete All
                </button>
              </div>
              {loading && <div>Loading...</div>}
              <ul className="space-y-4">
                {messages.map(msg => (
                  <li key={msg.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex flex-wrap justify-between gap-2">
                      <div>
                        <div className="font-semibold text-gray-900">{msg.subject}</div>
                        <div className="text-sm text-gray-600">{msg.name} — {msg.email}</div>
                      </div>
                      <div className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{msg.message}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === 'adoptions' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Adoptions</h2>
              <div className="grid gap-4">
                {adoptions.map((adopt) => (
                  <div key={adopt.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <div className="font-semibold text-gray-900">{adopt.tree_name || `#${adopt.tree_id}`}</div>
                        <div className="text-sm text-gray-600">{adopt.user_email || adopt.user_id}</div>
                      </div>
                      <div className="text-xs text-gray-500">{new Date(adopt.created_at).toLocaleString()}</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">Status: {adopt.status || 'n/a'} | Payment: {adopt.payment_status || 'n/a'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Report</h2>
                <form onSubmit={handleCreateReport} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adoption</label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={reportForm.adoptionId}
                      onChange={(e) => {
                        const adoptionId = e.target.value
                        const selected = adoptions.find((a) => a.id === adoptionId)
                        setReportForm((prev) => ({
                          ...prev,
                          adoptionId,
                          userId: selected?.user_id || '',
                          treeId: selected?.tree_id || '',
                        }))
                      }}
                      required
                    >
                      <option value="">Select adoption</option>
                      {adoptions.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.tree_name || a.tree_id} — {a.user_email || a.user_id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2"
                      value={reportForm.title}
                      onChange={(e) => setReportForm((p) => ({ ...p, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                    <textarea
                      className="w-full border rounded-lg px-3 py-2"
                      rows={4}
                      value={reportForm.body}
                      onChange={(e) => setReportForm((p) => ({ ...p, body: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PDF</label>
                      <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
                      <input type="file" multiple accept="image/*" onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))} />
                    </div>
                  </div>
                  <button className="bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors text-sm font-semibold">
                    Send Report
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Sent Reports</h3>
                <div className="space-y-4">
                  {reports.map((r) => (
                    <div key={r.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex flex-wrap justify-between gap-2">
                        <div>
                          <div className="font-semibold text-gray-900">{r.title}</div>
                          <div className="text-sm text-gray-600">Tree: {r.tree_id}</div>
                        </div>
                        <div className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString()}</div>
                      </div>
                      {r.body && <p className="text-sm text-gray-700 mt-2">{r.body}</p>}
                      <div className="mt-2 flex flex-wrap gap-3">
                        {r.pdf_url && (
                          <a href={r.pdf_url} target="_blank" rel="noreferrer" className="text-sage-700 text-sm underline">PDF</a>
                        )}
                        {Array.isArray(r.photo_urls) && r.photo_urls.map((url: string) => (
                          <a key={url} href={url} target="_blank" rel="noreferrer" className="text-sage-700 text-sm underline">Photo</a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminAuth>
  )
}
