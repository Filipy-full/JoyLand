'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [leafPositions, setLeafPositions] = useState<Array<{ id: number; left: number; delay: number }>>([])

  useEffect(() => {
    // Generar hojas cayendo
    setLeafPositions(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
      }))
    )
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white">
      {/* Floating Leaves Background */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none overflow-hidden">
        {leafPositions.map((leaf) => (
          <div
            key={leaf.id}
            className="absolute animate-leafFall text-4xl opacity-20"
            style={{
              left: `${leaf.left}%`,
              animationDelay: `${leaf.delay}s`,
            }}
          >
            🍂
          </div>
        ))}
      </div>

      {/* Hero Section con Imagen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/olivar-amanecer.jpeg"
            alt="Olivar al amanecer"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-serif text-white mb-6 leading-tight animate-fadeInUp drop-shadow-lg">
            Adopta Tu Árbol
          </h1>
          <p className="text-2xl md:text-3xl text-white mb-6 leading-relaxed drop-shadow-md animate-fadeInUp">
            Una conexión viva con la naturaleza
          </p>
          <p className="text-lg text-green-100 mb-8 drop-shadow-md">
            Cultiva un árbol en el norte de España y sigue su historia
          </p>
          <Link 
            href="/adopt"
            className="inline-block bg-gradient-to-r from-sage-600 to-sage-700 text-white px-12 py-5 rounded-full hover:shadow-2xl transition-all transform hover:scale-105 text-xl font-bold drop-shadow-lg"
          >
            Explorar Árboles
          </Link>
        </div>
      </section>

      {/* About Section - Natural & Honest */}
      <section className="py-24 px-6 bg-white relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/paisaje-natural.jpeg"
                alt="Paisaje natural"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="animate-slideInRight">
              <h2 className="text-4xl font-serif text-sage-700 mb-6">
                ¿Qué es Joyland?
              </h2>
              <p className="text-lg text-sage-800 mb-4 leading-relaxed">
                Joyland es una pequeña iniciativa de regeneración agrícola en el norte de España. 
                No es una inversión financiera, es una conexión.
              </p>
              <p className="text-lg text-sage-800 mb-4 leading-relaxed">
                Cuando adoptas un árbol, apoyas prácticas regenerativas que cuidan el suelo, 
                protegen la biodiversidad y crean ecosistemas más resilientes.
              </p>
              <p className="text-lg text-sage-800 leading-relaxed">
                Recibirás actualizaciones del progreso de tu árbol, fotos estacionales y los 
                productos que genera. Es una forma genuina de conectar con la naturaleza.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 px-6 bg-sage-50 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif text-sage-700 mb-4 text-center">
            Nuestro Olivar
          </h2>
          <p className="text-center text-sage-600 mb-12">
            Vistas de nuestro pequeño paraíso
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Image
                src="/olivar-atardecer.jpeg"
                alt="Olivar al atardecer"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
                <p className="text-white font-semibold p-4">Atardecer</p>
              </div>
            </div>

            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Image
                src="/almendros-flor.jpeg"
                alt="Almendros en flor"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
                <p className="text-white font-semibold p-4">Floración</p>
              </div>
            </div>

            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Image
                src="/campo-verde.jpeg"
                alt="Campo verde"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
                <p className="text-white font-semibold p-4">Verde</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-24 px-6 bg-white relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-serif text-sage-700 mb-12 text-center">
            Lo Que Incluye Tu Adopción
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-sage-50 rounded-lg border-l-4 border-sage-600 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-serif text-sage-700 mb-3">📍 Tu Árbol Personal</h3>
              <p className="text-sage-700">
                Acceso GPS a tu árbol con coordenadas exactas. Puedes visitarlo cuando quieras.
              </p>
            </div>

            <div className="p-8 bg-sage-50 rounded-lg border-l-4 border-sage-600 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-serif text-sage-700 mb-3">📸 Galería Privada</h3>
              <p className="text-sage-700">
                Fotos mensuales del crecimiento de tu árbol. Vídeos en las estaciones clave.
              </p>
            </div>

            <div className="p-8 bg-sage-50 rounded-lg border-l-4 border-sage-600 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-serif text-sage-700 mb-3">🎁 Productos Naturales</h3>
              <p className="text-sage-700">
                Aceite de oliva extra virgen o almendras gourmet según tu árbol. Directo a tu casa.
              </p>
            </div>

            <div className="p-8 bg-sage-50 rounded-lg border-l-4 border-sage-600 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-serif text-sage-700 mb-3">📖 Informe Anual</h3>
              <p className="text-sage-700">
                Documentación sobre el impacto ecológico de tu árbol y su crecimiento.
              </p>
            </div>

            <div className="p-8 bg-sage-50 rounded-lg border-l-4 border-sage-600 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-serif text-sage-700 mb-3">💚 Prácticas Sostenibles</h3>
              <p className="text-sage-700">
                Tu adopción apoya agricultura regenerativa y conservación de la biodiversidad.
              </p>
            </div>

            <div className="p-8 bg-sage-50 rounded-lg border-l-4 border-sage-600 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-serif text-sage-700 mb-3">🎀 Regalo Significativo</h3>
              <p className="text-sage-700">
                Puedes regalarlo con un certificado personalizado. Un obsequio que crece.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-sage-50 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-serif text-sage-700 mb-12 text-center">
            Historias Reales
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-green-500 mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-sage-800 mb-6 italic">
                "Adopté el olivo de mi abuelo. Visitarlo fue emocionante. Ahora recibo sus fotos cada mes."
              </p>
              <p className="font-semibold text-sage-700">Elena M.</p>
              <p className="text-sm text-sage-600">Adoptó hace 6 meses</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-green-500 mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-sage-800 mb-6 italic">
                "Regalé un almendro a mi madre. La ilusión que le hace recibir el aceite y las fotos... increíble."
              </p>
              <p className="font-semibold text-sage-700">Juan L.</p>
              <p className="text-sm text-sage-600">Regaló hace 10 meses</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-green-500 mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-sage-800 mb-6 italic">
                "Joyland me ayudó a reconectar con la naturaleza. El proyecto es genuino y transparente."
              </p>
              <p className="font-semibold text-sage-700">Rosa & Pedro</p>
              <p className="text-sm text-sage-600">Adoptaron hace 1 año</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-white relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-sage-700 mb-12 text-center">
            Elige Tu Árbol
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Link href="/adopt?type=olive">
              <div className="border-2 border-sage-300 p-8 rounded-lg hover:border-sage-600 transition-all hover:shadow-2xl cursor-pointer bg-gradient-to-br from-white to-sage-50">
                <h3 className="text-2xl font-serif text-sage-700 mb-2">
                  🫒 Olivo Centenario
                </h3>
                <p className="text-sage-600 mb-6">Árboles milenarios en plena producción</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-sage-700">€120</span>
                  <span className="text-sage-600">/año</span>
                </div>
                <ul className="space-y-3 mb-8 text-sage-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Aceite extra virgen premium
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Acceso GPS exclusivo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Galería privada mensual
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Certificado anual
                  </li>
                </ul>
                <button className="w-full bg-sage-600 text-white px-6 py-3 rounded-full hover:bg-sage-700 transition-all font-semibold">
                  Adoptar Olivo
                </button>
              </div>
            </Link>

            <Link href="/adopt?type=almond">
              <div className="border-2 border-sage-300 p-8 rounded-lg hover:border-sage-600 transition-all hover:shadow-2xl cursor-pointer bg-gradient-to-br from-white to-sage-50">
                <h3 className="text-2xl font-serif text-sage-700 mb-2">
                  🌸 Almendro Primavera
                </h3>
                <p className="text-sage-600 mb-6">Jóvenes árboles en floración</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-sage-700">€100</span>
                  <span className="text-sage-600">/año</span>
                </div>
                <ul className="space-y-3 mb-8 text-sage-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Almendras gourmet
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Acceso GPS exclusivo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Fotos estacionales
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Certificado anual
                  </li>
                </ul>
                <button className="w-full bg-sage-600 text-white px-6 py-3 rounded-full hover:bg-sage-700 transition-all font-semibold">
                  Adoptar Almendro
                </button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-sage-100 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-serif text-sage-700 mb-6">
            Comienza Tu Conexión
          </h2>
          <p className="text-lg text-sage-800 mb-8">
            Cada árbol que adoptas es una promesa de cuidado hacia la naturaleza.
          </p>
          <Link 
            href="/adopt"
            className="inline-block bg-sage-600 text-white px-12 py-4 rounded-full hover:bg-sage-700 transition-all text-lg font-semibold hover:shadow-lg"
          >
            Explorar Árboles
          </Link>
        </div>
      </section>
    </div>
  )
}
