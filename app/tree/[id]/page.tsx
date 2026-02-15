import { notFound } from 'next/navigation'
import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export default async function TreePage({ params }: { params: Promise<{ id?: string }> }) {
    // ...existing code...
    const { id } = await params
    if (!id) {
      notFound()
    }

    // Buscar todas as adoções para este árvore
    const { data: adoptions, error: adoptionsError } = await supabaseAdmin
      .from('adoptions')
      .select('user_name, tree_name')
      .eq('tree_id', id)
      .order('created_at', { ascending: false });

    // Pega o último adotante (mais recente)
    const adoption = Array.isArray(adoptions) && adoptions.length > 0 ? adoptions[0] : null;
 
  const { data: tree, error: treeError } = await supabaseAdmin
    .from('trees')
    .select('id, name, type, status, description, yearly_report, videos, latitude, longitude, year, width, height, root_zone, orientation, images')
    .eq('id', id)
    .single()
  if (treeError || !tree) {
    notFound()
  }

  // Extrair imagem principal do campo images
  let mainImage = '';
  if (tree && tree.images) {
    try {
      const arr = Array.isArray(tree.images) ? tree.images : JSON.parse(tree.images);
      if (Array.isArray(arr) && arr.length > 0) {
        mainImage = arr[0];
      }
    } catch {}
  }

  const { data: reports, error: reportsError } = await supabaseAdmin
    .from('reports')
    .select('id, title, body, pdf_url, photo_urls, created_at')
    .eq('tree_id', id)
    .order('created_at', { ascending: false })

  if (reportsError) {
    // ...existing code...
  }

  const yearValue = tree.year !== undefined && tree.year !== null
    ? String(tree.year)
    : 'Unknown'


  // ...existing code...

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-3xl border border-sage-200 shadow-xl p-8 bg-white/70 backdrop-blur-md flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {mainImage && (
              <div className="flex justify-center md:w-1/3">
                <Image
                  src={mainImage}
                  alt="Tree main image"
                  width={224}
                  height={224}
                  className="rounded-2xl shadow-lg h-56 w-auto object-cover border border-sage-200 bg-white/60"
                  loading="lazy"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-sage-700 mb-3 tracking-tight drop-shadow">{adoption?.tree_name || tree.name || `Tree #${tree.id}`}</h1>
              {adoption?.user_name && (
                <div className="mb-2 text-sage-600 text-lg font-semibold">Adopted by: {adoption.user_name}</div>
              )}
              <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow ${tree.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{tree.status === 'available' ? 'Available' : 'Adopted'}</span>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div className="bg-sage-50/60 rounded-xl p-4 shadow-sm">
                  <span className="font-semibold text-sage-700">Specie</span>
                  <div className="text-gray-900 text-lg mt-1">{tree.type || 'n/a'}</div>
                </div>
                <div className="bg-sage-50/60 rounded-xl p-4 shadow-sm">
                  <span className="font-semibold text-sage-700">Year</span>
                  <div className="text-gray-900 text-lg mt-1">{yearValue}</div>
                </div>
                <div className="bg-sage-50/60 rounded-xl p-4 shadow-sm">
                  <span className="font-semibold text-sage-700">Zone</span>
                  <div className="text-gray-900 text-lg mt-1">{tree.area || tree.orientation || 'Unknown'}</div>
                </div>
                <div className="bg-sage-50/60 rounded-xl p-4 shadow-sm">
                  <span className="font-semibold text-sage-700">Root Zone</span>
                  <div className="text-gray-900 text-lg mt-1">{tree.root_zone || 'Unknown'}</div>
                </div>
                <div className="bg-sage-50/60 rounded-xl p-4 shadow-sm">
                  <span className="font-semibold text-sage-700">Lat</span>
                  <div className="text-gray-900 text-lg mt-1">{tree.latitude ?? 'n/a'}</div>
                </div>
                <div className="bg-sage-50/60 rounded-xl p-4 shadow-sm">
                  <span className="font-semibold text-sage-700">Lon</span>
                  <div className="text-gray-900 text-lg mt-1">{tree.longitude ?? 'n/a'}</div>
                </div>
                <div className="col-span-2 sm:col-span-3 bg-sage-50/60 rounded-xl p-4 shadow-sm">
                  <span className="font-semibold text-sage-700">Size</span>
                  <div className="text-gray-900 text-lg mt-1">
                    {typeof tree.width === 'number' && `Width: ${tree.width} m`} {typeof tree.height === 'number' && `· Height: ${tree.height} m`}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {tree.description && (
            <div className="mt-2 bg-white/60 rounded-xl p-6 shadow">
              <span className="font-semibold text-sage-700 text-lg">Description</span>
              <p className="text-gray-700 mt-2 text-base">{tree.description}</p>
            </div>
          )}
          {tree.yearly_report && (
            <p className="mt-3 text-sm text-gray-600 bg-white/60 rounded-xl p-4 shadow">{tree.yearly_report}</p>
          )}
          {tree.videos && (
            <div className="mt-6 flex justify-center">
              {typeof tree.videos === 'string' && tree.videos.endsWith('.mp4') ? (
                <video controls width="100%" className="rounded-2xl max-w-lg shadow-xl bg-black/60">
                  <source src={tree.videos} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : typeof tree.videos === 'string' && (tree.videos.includes('youtube.com') || tree.videos.includes('youtu.be')) ? (
                <iframe
                  width="100%"
                  height="315"
                  src={tree.videos.replace('watch?v=', 'embed/')}
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-2xl max-w-lg shadow-xl bg-black/60"
                  style={{ background: 'rgba(0,0,0,0.6)' }}
                />
              ) : typeof tree.videos === 'string' && tree.videos.includes('vimeo.com') ? (
                <iframe
                  width="100%"
                  height="315"
                  src={tree.videos.replace('vimeo.com/', 'player.vimeo.com/video/')}
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-2xl max-w-lg shadow-xl bg-black/60"
                  style={{ background: 'rgba(0,0,0,0.6)' }}
                />
              ) : (
                <a href={tree.videos} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  View Video
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
