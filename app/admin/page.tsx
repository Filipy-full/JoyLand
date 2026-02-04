"use client"

import { useEffect, useState } from 'react'
import AdminAuth from '@/components/AdminAuth'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [messages, setMessages] = useState<any[]>([])
  const [adoptions, setAdoptions] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'messages' | 'adoptions' | 'reports' | 'stats' | 'trees'>('messages')
  const [reportForm, setReportForm] = useState({
    adoptionId: '',
    userId: '',
    treeId: '',
    title: '',
    body: '',
  })
  const [trees, setTrees] = useState<any[]>([])
  const [treesWarning, setTreesWarning] = useState('')
  const [treesSuccess, setTreesSuccess] = useState('')
  const [treeEdit, setTreeEdit] = useState({
    treeId: '',
    year: '',
  })
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [editingPrice, setEditingPrice] = useState(false)
  const [almondPrice, setAlmondPrice] = useState('')
  const [olivePrice, setOlivePrice] = useState('')
  const [replyingTo, setReplyingTo] = useState<any>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [replySending, setReplySending] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
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
      console.log('Adoptions data:', body.adoptions)
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

  const fetchTrees = async (token: string) => {
    setTreesWarning('')
    const res = await fetch('/api/admin/trees', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error || 'Error al cargar árboles')
      return
    }
    const body = await res.json()
    const sortedTrees = [...(body.trees || [])].sort((a, b) => {
      const nameA = (a.name || '').toString()
      const nameB = (b.name || '').toString()
      const nameCompare = nameA.localeCompare(nameB, undefined, { numeric: true })
      if (nameCompare !== 0) return nameCompare
      return String(a.id).localeCompare(String(b.id), undefined, { numeric: true })
    })
    setTrees(sortedTrees)
    if (treeEdit.treeId) {
      const current = sortedTrees.find((t) => t.id === treeEdit.treeId)
      if (current) {
        setTreeEdit((prev) => ({
          ...prev,
          year: current.year !== undefined && current.year !== null ? String(current.year).padStart(4, '0') : '0000',
        }))
      }
    }
    if (body.warning || body.yearAvailable === false) {
      setTreesWarning('A coluna year não existe na tabela trees. Adicione no Supabase para editar o ano.')
    }
  }

  const handleUpdateTree = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setTreesSuccess('')

    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (!token) {
      setError('No autorizado')
      return
    }

    if (!treeEdit.treeId) {
      setError('Select a tree')
      return
    }

    const yearValue = treeEdit.year.trim() === '' ? null : Number(treeEdit.year)
    if (treeEdit.year.trim() !== '' && (Number.isNaN(yearValue) || (yearValue !== null && yearValue < 0))) {
      setError('Invalid year')
      return
    }

    const res = await fetch('/api/admin/trees', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: treeEdit.treeId,
        year: yearValue,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error || 'Error updating tree')
      return
    }

    await fetchTrees(token)
    setTreesSuccess('Ano atualizado com sucesso.')
  }

  const fetchStats = async (token: string) => {
    const res = await fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const body = await res.json()
      setStats(body.stats || null)
      setAlmondPrice(body.stats?.almondPrice?.toString() || '200')
      setOlivePrice(body.stats?.olivePrice?.toString() || '200')
    }
  }

  const handleUpdatePrice = async () => {
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (!token) {
      setError('No autorizado')
      return
    }

    const aPrice = parseFloat(almondPrice)
    const oPrice = parseFloat(olivePrice)
    if (isNaN(aPrice) || isNaN(oPrice) || aPrice < 0 || oPrice < 0) {
      setError('Invalid prices')
      return
    }

    const res = await fetch('/api/admin/pricing', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ almondPrice: aPrice, olivePrice: oPrice }),
    })

    if (res.ok) {
      setEditingPrice(false)
      await fetchStats(token)
    } else {
      const body = await res.json()
      setError(body.error || 'Error updating prices')
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
      await fetchStats(token)
      await fetchTrees(token)
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

  const handleSendReply = async () => {
    if (!replyingTo || !replyMessage.trim()) return
    setReplySending(true)
    try {
      console.log('🔵 [CLIENT] Preparing to send reply to:', replyingTo.email)
      const payload = {
        messageId: replyingTo.id,
        toEmail: replyingTo.email,
        toName: replyingTo.name,
        subject: `Re: ${replyingTo.subject}`,
        message: replyMessage,
      }
      console.log('🔵 [CLIENT] Payload:', payload)
      
      const res = await fetch('/api/admin/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      console.log('🔵 [CLIENT] Response status:', res.status)
      const text = await res.text()
      console.log('🔵 [CLIENT] Response text:', text)
      
      let data: any = {}
      if (text) {
        try {
          data = JSON.parse(text)
          console.log('🔵 [CLIENT] Parsed JSON:', data)
        } catch (e) {
          console.error('🔴 [CLIENT] Failed to parse JSON:', e)
          data = { error: 'Invalid JSON response from server', raw: text }
        }
      } else {
        console.error('🔴 [CLIENT] Empty response body')
        data = { error: 'Empty response from server' }
      }
      
      if (res.ok && data.success) {
        console.log('🟢 [CLIENT] Reply saved successfully!')
        setReplyingTo(null)
        setReplyMessage('')
        alert('✅ Respuesta guardada correctamente')
      } else {
        console.error('🔴 [CLIENT] Request failed, data:', data)
        alert(`❌ Error al guardar: ${data.error || 'Error desconocido'}`)
      }
    } catch (err) {
      console.error('🔴 [CLIENT] Exception:', err)
      alert(`❌ Error de conexión: ${String(err)}`)
    } finally {
      setReplySending(false)
    }
  }

  const handleDeleteAllReports = async () => {
    if (!confirm('This will hide all reports from your dashboard. Users will still be able to see them. Continue?')) return;
    setError('')
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (!token) {
      setError('No autorizado')
      return
    }
    const res = await fetch('/api/admin/reports', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error || 'Error al borrar reports')
    }
    await fetchReports(token)
  }

  const handleDeleteUserReports = async (userId: string, userEmail: string) => {
    if (!confirm(`¿Eliminar TODOS los reportes de ${userEmail}? Esta acción no se puede deshacer.`)) return
    
    setDeletingUserId(userId)
    setError('')

    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (!token) {
      setError('No autorizado')
      setDeletingUserId(null)
      return
    }

    const res = await fetch(`/api/admin/reports/user?userId=${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error || 'Error al eliminar reportes del usuario')
    } else {
      await fetchReports(token)
    }

    setDeletingUserId(null)
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
            <button
              onClick={() => setTab('trees')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === 'trees' ? 'bg-sage-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Trees
            </button>
            <button
              onClick={() => setTab('stats')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === 'stats' ? 'bg-sage-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Stats
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${tab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              />
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {error && <div className="text-red-600 mb-4">{error}</div>}
          {treesWarning && <div className="text-amber-700 mb-4">{treesWarning}</div>}
          {treesSuccess && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {treesSuccess}
            </div>
          )}

          {tab === 'stats' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {stats ? (
                <div>
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
                    <div className="flex items-center gap-3">
                      {editingPrice ? (
                        <div className="flex gap-2">
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-amber-700">Almond:</label>
                            <input
                              type="number"
                              value={almondPrice}
                              onChange={(e) => setAlmondPrice(e.target.value)}
                              className="w-20 px-2 py-1 border rounded-lg text-sm"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-sage-700">Olive:</label>
                            <input
                              type="number"
                              value={olivePrice}
                              onChange={(e) => setOlivePrice(e.target.value)}
                              className="w-20 px-2 py-1 border rounded-lg text-sm"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <button
                            onClick={handleUpdatePrice}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPrice(false)}
                            className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-amber-700">🌰 Almond:</span>
                            <span className="text-lg font-bold text-amber-600">€{stats.almondPrice}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-sage-700">🫒 Olive:</span>
                            <span className="text-lg font-bold text-sage-600">€{stats.olivePrice}</span>
                          </div>
                          <button
                            onClick={() => setEditingPrice(true)}
                            className="px-3 py-1 bg-sage-600 text-white rounded-lg hover:bg-sage-700 text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Resumen General */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
                      <p className="text-sm text-green-700 font-medium mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold text-green-900">€{stats.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-green-600 mt-2">{stats.totalAdoptions} adoptions × €{stats.treePrice}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
                      <p className="text-sm text-blue-700 font-medium mb-1">Potential Revenue</p>
                      <p className="text-3xl font-bold text-blue-900">€{stats.maxRevenue.toLocaleString()}</p>
                      <p className="text-xs text-blue-600 mt-2">{stats.totalTrees} total trees × €{stats.treePrice}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
                      <p className="text-sm text-purple-700 font-medium mb-1">Available Trees</p>
                      <p className="text-3xl font-bold text-purple-900">{stats.availableTrees}</p>
                      <p className="text-xs text-purple-600 mt-2">Remaining: €{(stats.availableTrees * stats.treePrice).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Estadísticas por Tipo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Almendros */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-amber-700 mb-4 flex items-center gap-2">
                        🌰 Almond Trees
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Adoptions</span>
                          <span className="font-semibold text-gray-900">{stats.almondAdoptions} / {stats.totalAlmondTrees}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Revenue</span>
                          <span className="font-semibold text-green-600">€{stats.almondRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Max Potential</span>
                          <span className="font-semibold text-blue-600">€{stats.maxAlmondRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Available</span>
                          <span className="font-semibold text-amber-600">{stats.availableAlmond} trees</span>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Completion</span>
                            <span className="text-xs font-semibold text-gray-700">{((stats.almondAdoptions / stats.totalAlmondTrees) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(stats.almondAdoptions / stats.totalAlmondTrees) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Olivos */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-sage-700 mb-4 flex items-center gap-2">
                        🫒 Olive Trees
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Adoptions</span>
                          <span className="font-semibold text-gray-900">{stats.oliveAdoptions} / {stats.totalOliveTrees}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Revenue</span>
                          <span className="font-semibold text-green-600">€{stats.oliveRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Max Potential</span>
                          <span className="font-semibold text-blue-600">€{stats.maxOliveRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Available</span>
                          <span className="font-semibold text-sage-600">{stats.availableOlive} trees</span>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Completion</span>
                            <span className="text-xs font-semibold text-gray-700">{((stats.oliveAdoptions / stats.totalOliveTrees) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-sage-500 h-2 rounded-full" style={{ width: `${(stats.oliveAdoptions / stats.totalOliveTrees) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Loading statistics...</div>
              )}
            </div>
          )}

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
                {messages
                  .filter(msg => {
                    if (!searchQuery) return true;
                    const query = searchQuery.toLowerCase();
                    return (
                      msg.subject?.toLowerCase().includes(query) ||
                      msg.name?.toLowerCase().includes(query) ||
                      msg.email?.toLowerCase().includes(query) ||
                      msg.message?.toLowerCase().includes(query)
                    );
                  })
                  .map(msg => (
                  <li key={msg.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex flex-wrap justify-between gap-2">
                      <div>
                        <div className="font-semibold text-gray-900">{msg.subject}</div>
                        <div className="text-sm text-gray-600">{msg.name} — {msg.email}</div>
                      </div>
                      <div className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{msg.message}</p>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reply Modal */}
          {replyingTo && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reply to {replyingTo.name}</h3>
                <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-700 max-h-32 overflow-y-auto">
                  <strong>Original message:</strong>
                  <p className="mt-2">{replyingTo.message}</p>
                </div>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4 h-32 resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyMessage('')
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendReply}
                    disabled={replySending || !replyMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {replySending ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'adoptions' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Adoptions</h2>
              
              {/* Almendros */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-amber-700 mb-3 flex items-center gap-2">
                  🌰 Almond Trees ({adoptions.filter(a => a.trees?.type === 'almond').length})
                </h3>
                <div className="grid gap-3">
                  {adoptions
                    .filter(a => a.trees?.type === 'almond')
                    .filter(a => {
                      if (!searchQuery) return true;
                      const query = searchQuery.toLowerCase();
                      return (
                        a.tree_name?.toLowerCase().includes(query) ||
                        a.tree_id?.toLowerCase().includes(query) ||
                        a.user_email?.toLowerCase().includes(query) ||
                        a.user_id?.toLowerCase().includes(query)
                      );
                    }).length > 0 ? (
                    adoptions
                      .filter(a => a.trees?.type === 'almond')
                      .filter(a => {
                        if (!searchQuery) return true;
                        const query = searchQuery.toLowerCase();
                        return (
                          a.tree_name?.toLowerCase().includes(query) ||
                          a.tree_id?.toLowerCase().includes(query) ||
                          a.user_email?.toLowerCase().includes(query) ||
                          a.user_id?.toLowerCase().includes(query)
                        );
                      })
                      .map((adopt) => (
                      <div key={adopt.id} className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                        <div className="flex flex-wrap justify-between gap-3">
                          <div>
                            <div className="font-semibold text-gray-900">{adopt.tree_name || `#${adopt.tree_id}`}</div>
                            <div className="text-sm text-gray-600">{adopt.user_email || adopt.user_id}</div>
                          </div>
                          <div className="text-xs text-gray-500">{new Date(adopt.created_at).toLocaleString()}</div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">Status: {adopt.status || 'n/a'} | Payment: {adopt.payment_status || 'n/a'}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No almond tree adoptions yet</p>
                  )}
                </div>
              </div>

              {/* Olivos */}
              <div>
                <h3 className="text-lg font-semibold text-sage-700 mb-3 flex items-center gap-2">
                  🫒 Olive Trees ({adoptions.filter(a => a.trees?.type === 'olive').length})
                </h3>
                <div className="grid gap-3">
                  {adoptions
                    .filter(a => a.trees?.type === 'olive')
                    .filter(a => {
                      if (!searchQuery) return true;
                      const query = searchQuery.toLowerCase();
                      return (
                        a.tree_name?.toLowerCase().includes(query) ||
                        a.tree_id?.toLowerCase().includes(query) ||
                        a.user_email?.toLowerCase().includes(query) ||
                        a.user_id?.toLowerCase().includes(query)
                      );
                    }).length > 0 ? (
                    adoptions
                      .filter(a => a.trees?.type === 'olive')
                      .filter(a => {
                        if (!searchQuery) return true;
                        const query = searchQuery.toLowerCase();
                        return (
                          a.tree_name?.toLowerCase().includes(query) ||
                          a.tree_id?.toLowerCase().includes(query) ||
                          a.user_email?.toLowerCase().includes(query) ||
                          a.user_id?.toLowerCase().includes(query)
                        );
                      })
                      .map((adopt) => (
                      <div key={adopt.id} className="border border-sage-200 rounded-lg p-4 bg-sage-50">
                        <div className="flex flex-wrap justify-between gap-3">
                          <div>
                            <div className="font-semibold text-gray-900">{adopt.tree_name || `#${adopt.tree_id}`}</div>
                            <div className="text-sm text-gray-600">{adopt.user_email || adopt.user_id}</div>
                          </div>
                          <div className="text-xs text-gray-500">{new Date(adopt.created_at).toLocaleString()}</div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">Status: {adopt.status || 'n/a'} | Payment: {adopt.payment_status || 'n/a'}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No olive tree adoptions yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'trees' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Tree Data</h2>
                <form onSubmit={handleUpdateTree} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tree *</label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={treeEdit.treeId}
                      onChange={(e) => {
                        const treeId = e.target.value
                        const tree = trees.find((t) => t.id === treeId)
                        setTreeEdit({
                          treeId,
                          year: tree?.year !== undefined && tree?.year !== null ? String(tree.year).padStart(4, '0') : '0000',
                        })
                      }}
                      required
                    >
                      <option value="">Select tree</option>
                      {trees.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name || `Tree #${t.id}`} ({t.type})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year (0000 if unknown)</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2"
                      value={treeEdit.year}
                      onChange={(e) => setTreeEdit((p) => ({ ...p, year: e.target.value }))}
                      placeholder="0000"
                      inputMode="numeric"
                    />
                  </div>
                  <button className="bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors text-sm font-semibold w-full">
                    Save
                  </button>
                </form>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
                <p className="text-sm text-gray-600">
                  Use 0000 when the year is unknown. This value will be shown on the map and checkout.
                </p>
              </div>
            </div>
          )}

          {tab === 'reports' && (
            <div className="space-y-6">
              {/* Delete reports by user */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Eliminar Reportes por Usuario</h2>
                <div className="space-y-3">
                  {Array.from(new Set(adoptions.map(a => a.user_id).filter(Boolean))).map((userId) => {
                    const userAdoption = adoptions.find(a => a.user_id === userId)
                    if (!userAdoption) return null
                    const userReportsCount = reports.filter(r => r.user_id === userId).length
                    return (
                      <div key={userId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{userAdoption.user_email || userId}</p>
                          <p className="text-xs text-gray-500">{userReportsCount} reporte(s)</p>
                        </div>
                        <button
                          onClick={() => handleDeleteUserReports(userId, userAdoption.user_email || userId)}
                          disabled={deletingUserId === userId || userReportsCount === 0}
                          className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingUserId === userId ? 'Eliminando...' : 'Eliminar Reportes'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Report</h2>
                <form onSubmit={handleCreateReport} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tree *</label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={reportForm.treeId}
                      onChange={(e) => {
                        const treeId = e.target.value
                        const adoption = adoptions.find((a) => a.tree_id === treeId)
                        setReportForm((prev) => ({
                          ...prev,
                          treeId,
                          adoptionId: adoption?.id || '',
                          userId: adoption?.user_id || '',
                        }))
                      }}
                      required
                    >
                      <option value="">Select tree</option>
                      {trees.map((t) => {
                        const adoption = adoptions.find((a) => a.tree_id === t.id)
                        return (
                          <option key={t.id} value={t.id}>
                            {t.name || `Tree #${t.id}`} - {t.type} {adoption ? `(Adopted by ${adoption.user_email})` : '(Not adopted)'}
                          </option>
                        )
                      })}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Reports can be created even if the tree is not adopted</p>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PDF</label>
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-sage-50 file:text-sage-700 hover:file:bg-sage-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))}
                      className="w-full text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                  </div>
                  <button className="bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors text-sm font-semibold w-full">
                    Send Report
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Sent Reports</h3>
                  <button
                    onClick={handleDeleteAllReports}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                    disabled={reports.length === 0}
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-4">
                  {reports
                    .filter(r => {
                      if (!searchQuery) return true;
                      const query = searchQuery.toLowerCase();
                      return (
                        r.title?.toLowerCase().includes(query) ||
                        r.body?.toLowerCase().includes(query) ||
                        r.tree_id?.toLowerCase().includes(query)
                      );
                    })
                    .map((r) => (
                    <div key={r.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex flex-wrap justify-between gap-2">
                        <div>
                          <div className="font-semibold text-gray-900">{r.title}</div>
                          <div className="text-sm text-gray-600">Tree: {r.tree_id}</div>
                        </div>
                        <div className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString()}</div>
                      </div>
                      {r.body && <p className="text-sm text-gray-700 mt-2">{r.body}</p>}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {r.pdf_url && (
                          <a href={r.pdf_url} target="_blank" rel="noreferrer" className="inline-flex items-center px-3 py-1.5 bg-sage-600 text-white text-xs font-medium rounded-lg hover:bg-sage-700 transition-colors">📄 PDF</a>
                        )}
                        {Array.isArray(r.photo_urls) && r.photo_urls.map((url: string, i: number) => (
                          <a key={url} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors">📷 Photo {i + 1}</a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminAuth>
  )
}
