'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Adoption {
  id: string
  tree_id: string
  user_id: string
  user_name: string
  user_email: string
  status?: string
  payment_status?: string
  start_date?: string
  end_date?: string
  certificate_code?: string
  certificate_url?: string
  tree_name?: string
  gift_message?: string
  created_at: string
  width?: number;
  height?: number;
  root_zone?: string;
  orientation?: string;
}

interface ReportItem {
  id: string
  adoption_id: string
  tree_id: string
  title: string
  body?: string
  pdf_url?: string
  photo_urls?: string[]
  created_at: string
}



export default function DashboardClient() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [adoptions, setAdoptions] = useState<Adoption[]>([])
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      try {
        const session = await supabase.auth.getSession()
        const token = session.data.session?.access_token
        if (!token) throw new Error('No token')
        const [adoptRes, reportsRes] = await Promise.all([
          fetch('/api/user/adoptions', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/user/reports', { headers: { 'Authorization': `Bearer ${token}` } })
        ])
        const data = await adoptRes.json()
        // Buscar root_zone e orientation para cada adoção
        const adoptionsWithTreeData = await Promise.all(
          (data.adoptions || []).map(async (adoption: Adoption) => {
            if (!adoption.tree_id) return adoption;
            try {
              const res = await fetch(`/api/trees?id=${adoption.tree_id}`);
              if (!res.ok) return adoption;
              const treeData = await res.json();
              return {
                ...adoption,
                root_zone: treeData.tree?.root_zone || '',
                orientation: treeData.tree?.orientation || '',
              };
            } catch {
              return adoption;
            }
          })
        );
        setAdoptions(adoptionsWithTreeData)
        const reportsData = await reportsRes.json()
        setReports(reportsData.reports || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🌳 Mi Dashboard</h1>
              <p className="text-gray-600 mt-1">Bienvenido, {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>



      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Árboles Adoptados</p>
                <p className="text-3xl font-bold text-sage-600 mt-2">{adoptions.length}</p>
              </div>
              <div className="text-4xl">🌳</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pagos Completados</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {adoptions.filter(a => a.payment_status === 'completed').length}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Certificados</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {adoptions.filter(a => a.certificate_code).length}
                </p>
              </div>
              <div className="text-4xl">📜</div>
            </div>
          </div>
        </div>

        {/* Mis Adopciones */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-sage-600 to-sage-700">
            <h2 className="text-xl font-bold text-white">📍 Mis Árboles Adoptados</h2>
          </div>

          {adoptions.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-4">Aún no has adoptado ningún árbol</p>
              <Link href="/adopt/map">
                <button className="bg-sage-600 hover:bg-sage-700 text-white px-6 py-2 rounded-lg transition">
                  🌱 Explorar árboles
                </button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {adoptions.map((adoption) => {
                const treeReports = reports.filter(r => r.tree_id === adoption.tree_id)
                return (
                  <div key={adoption.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      {/* Árbol Info */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">ÁRBOL</p>
                        <p className="font-semibold text-gray-900">{adoption.tree_name || `#${adoption.tree_id}`}</p>
                        <p className="text-sm text-gray-600 mt-1">ID: {adoption.tree_id}</p>
                        {typeof adoption.width === 'number' && (
                          <p className="text-xs text-gray-700">Ancho: {adoption.width} m</p>
                        )}
                        {typeof adoption.height === 'number' && (
                          <p className="text-xs text-gray-700">Altura: {adoption.height} m</p>
                        )}
                        {adoption.root_zone && (
                          <p className="text-xs text-gray-700">Root Zone: {adoption.root_zone}</p>
                        )}
                        {adoption.orientation && (
                          <p className="text-xs text-gray-700">Orientation: {adoption.orientation}</p>
                        )}
                      </div>

                      {/* Estado */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">ESTADO</p>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                            adoption.status === 'adopted' ? 'bg-green-600' : 
                            adoption.status === 'reserved' ? 'bg-yellow-600' : 
                            'bg-gray-600'
                          }`}>
                            {adoption.status === 'adopted' ? '✅ Adoptado' :
                             adoption.status === 'reserved' ? '⏳ Reservado' :
                             '📝 Disponible'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                            adoption.payment_status === 'completed' ? 'bg-blue-600' :
                            adoption.payment_status === 'pending' ? 'bg-orange-600' :
                            'bg-red-600'
                          }`}>
                            {adoption.payment_status === 'completed' ? '💳 Pagado' :
                             adoption.payment_status === 'pending' ? '⏳ Pendiente' :
                             '❌ Error'}
                          </span>
                        </div>
                      </div>

                      {/* Fechas */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">PERÍODO</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {adoption.start_date ? new Date(adoption.start_date).toLocaleDateString('es-ES') : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          hasta {adoption.end_date ? new Date(adoption.end_date).toLocaleDateString('es-ES') : 'N/A'}
                        </p>
                      </div>

                      {/* Acciones */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2">ACCIONES</p>
                        <div className="space-y-2">
                          {adoption.certificate_url && (
                            <a href={adoption.certificate_url} target="_blank" rel="noopener noreferrer">
                              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-1.5 rounded transition">
                                📥 Descargar PDF
                              </button>
                            </a>
                          )}
                          <Link href={`/tree/${adoption.tree_id}`}>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 rounded transition">
                              🌳 Ver Árbol
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Mensaje de regalo */}
                    {adoption.gift_message && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
                        <p className="text-xs text-amber-700 font-semibold mb-1">💝 Mensaje Personal:</p>
                        <p className="text-sm text-amber-900 italic">"{adoption.gift_message}"</p>
                      </div>
                    )}

                    {/* Certificado Info */}
                    {adoption.certificate_code && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-xs text-blue-700 font-semibold mb-1">📜 Certificado:</p>
                        <p className="text-sm text-blue-900 font-mono">{adoption.certificate_code}</p>
                      </div>
                    )}

                    {/* Reportes del árbol */}
                    {treeReports.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">📄 Reportes de este árbol ({treeReports.length})</h4>
                        <div className="space-y-3">
                          {treeReports.map((r) => (
                            <div key={r.id} className="p-3 bg-blue-50 border border-blue-200 rounded">
                              <div className="flex flex-wrap justify-between gap-2 mb-2">
                                <div className="font-semibold text-blue-900 text-sm">{r.title}</div>
                                <div className="text-xs text-blue-600">{new Date(r.created_at).toLocaleDateString('es-ES')}</div>
                              </div>
                              {r.body && <p className="text-xs text-blue-800 mt-1">{r.body}</p>}
                              <div className="mt-2 flex flex-wrap gap-2">
                                {r.pdf_url && (
                                  <a href={r.pdf_url} target="_blank" rel="noreferrer" className="text-blue-700 text-xs underline font-medium">
                                    📥 PDF
                                  </a>
                                )}
                                {Array.isArray(r.photo_urls) && r.photo_urls.map((url, idx) => (
                                  <a key={url} href={url} target="_blank" rel="noreferrer" className="text-blue-700 text-xs underline font-medium">
                                    🖼️ Foto {idx + 1}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sección de Información */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Próximas Renovaciones */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔄 Próximas Renovaciones</h3>
            {adoptions.filter(a => {
              const endDate = a.end_date ? new Date(a.end_date).getTime() : Date.now() + 1000
              const now = Date.now()
              return endDate > now && (endDate - now) < 60 * 24 * 60 * 60 * 1000 // próximos 60 días
            }).length > 0 ? (
              <div className="space-y-3">
                {adoptions
                  .filter(a => {
                    const endDate = a.end_date ? new Date(a.end_date).getTime() : Date.now() + 1000
                    const now = Date.now()
                    return endDate > now && (endDate - now) < 60 * 24 * 60 * 60 * 1000
                  })
                  .map(a => (
                    <div key={a.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm font-semibold text-yellow-900">
                        {a.tree_name || `#${a.tree_id}`} vence el {a.end_date ? new Date(a.end_date).toLocaleDateString('es-ES') : 'N/A'}
                      </p>
                      <Link href={`/adopt/map/${a.tree_id}`}>
                        <button className="mt-2 text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded transition">
                          Renovar ahora
                        </button>
                      </Link>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-600">No hay renovaciones próximas</p>
            )}
          </div>

          {/* Ayuda */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">❓ Preguntas Frecuentes</h3>
            <div className="space-y-3">
              <a href="/faq" className="block p-3 hover:bg-gray-50 border border-gray-200 rounded transition">
                <p className="text-sm font-semibold text-blue-600">¿Cómo funciona la adopción?</p>
              </a>
              <a href="/contact" className="block p-3 hover:bg-gray-50 border border-gray-200 rounded transition">
                <p className="text-sm font-semibold text-blue-600">Contactar Soporte</p>
              </a>
              <Link href="/adopt/map">
                <button className="w-full p-3 hover:bg-gray-50 border border-gray-200 rounded transition text-left">
                  <p className="text-sm font-semibold text-blue-600">Adoptar otro árbol</p>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
