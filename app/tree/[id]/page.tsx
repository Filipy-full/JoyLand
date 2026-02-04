import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export default async function TreePage({ params }: { params: Promise<{ id?: string }> }) {
  const { id } = await params
  if (!id) {
    notFound()
  }

  const { data: tree, error: treeError } = await supabaseAdmin
    .from('trees')
    .select('id, name, type, status, description, yearly_report, videos, latitude, longitude, year')
    .eq('id', id)
    .single()

  if (treeError || !tree) {
    notFound()
  }

  const { data: reports, error: reportsError } = await supabaseAdmin
    .from('reports')
    .select('id, title, body, pdf_url, photo_urls, created_at')
    .eq('tree_id', id)
    .order('created_at', { ascending: false })

  if (reportsError) {
    console.error('Error fetching reports:', reportsError)
  }

  const yearValue = tree.year !== undefined && tree.year !== null
    ? String(tree.year).padStart(4, '0')
    : '0000'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {tree.name || `Tree #${tree.id}`}
              </h1>
              <p className="text-sm text-gray-500">Tipo: {tree.type || 'n/a'} · Año: {yearValue}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tree.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {tree.status === 'available' ? 'Disponible' : 'Adoptado'}
            </span>
          </div>
          {tree.description && (
            <p className="mt-4 text-gray-700">{tree.description}</p>
          )}
          {tree.yearly_report && (
            <p className="mt-3 text-sm text-gray-600">{tree.yearly_report}</p>
          )}
          {tree.videos && (
            <p className="mt-3 text-sm text-gray-600">{tree.videos}</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reportes del árbol</h2>
          {reports && reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {report.body && <p className="text-sm text-gray-700 mt-2">{report.body}</p>}
                  <div className="mt-3 flex flex-wrap gap-3">
                    {report.pdf_url && (
                      <a className="text-sm text-sage-700 underline" href={report.pdf_url} target="_blank" rel="noreferrer">
                        Ver PDF
                      </a>
                    )}
                    {Array.isArray(report.photo_urls) && report.photo_urls.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {report.photo_urls.map((url: string, idx: number) => (
                          <a key={`${report.id}-photo-${idx}`} href={url} target="_blank" rel="noreferrer" className="text-sm text-sage-700 underline">
                            Foto {idx + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aún no hay reportes para este árbol.</p>
          )}
        </div>
      </div>
    </div>
  )
}
