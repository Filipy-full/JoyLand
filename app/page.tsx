import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/60 to-amber-50/30" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif text-orange-900 mb-6 leading-tight">
            Adopta Tu Árbol Hoy 🌿
          </h1>
          <p className="text-xl md:text-2xl text-orange-800 mb-4 leading-relaxed">
            Olivares y almendros exclusivos en el norte de España
          </p>
          <p className="text-lg text-orange-600 mb-8 font-semibold">
            ⚡ Solo quedan 15 árboles disponibles
          </p>
          <Link 
            href="/adopt"
            className="inline-block bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white px-12 py-5 rounded-full hover:shadow-xl transition-all transform hover:scale-105 text-xl font-bold"
          >
            ADOPTAR AHORA →
          </Link>
          <p className="text-sm text-orange-700 mt-4">✓ Proceso en 3 minutos · ✓ Garantía de satisfacción</p>
        </div>
      </section>

      {/* What is Joyland Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-orange-900 mb-8 text-center">
            La Inversión Más Significativa de €100
          </h2>
          <div className="prose prose-lg mx-auto text-orange-800 leading-relaxed space-y-4">
            <p className="text-xl font-medium text-center">
              Joyland te permite poseer tu propio árbol en un olivar premium del norte de España. 
              Recibe productos exclusivos, acceso VIP a tu árbol y vive una experiencia única 
              durante todo un año.
            </p>
            <div className="grid md:grid-cols-3 gap-6 not-prose mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">500+</div>
                <div className="text-sm text-orange-700">Árboles adoptados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">98%</div>
                <div className="text-sm text-orange-700">Satisfacción</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">4.9/5</div>
                <div className="text-sm text-orange-700">Valoración media</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 px-6 bg-orange-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif text-orange-900 mb-4 text-center">
            Todo Lo Que Recibes Por Solo €100-120/Año
          </h2>
          <p className="text-center text-xl text-orange-600 mb-12 font-medium">
            Un paquete completo de experiencias y productos premium
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow border-2 border-transparent hover:border-orange-300">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="text-xl font-serif mb-3 text-orange-900">
                Acceso GPS Exclusivo
              </h3>
              <p className="text-orange-700 leading-relaxed">
                Coordenadas exactas + derecho de visita ilimitado a TU árbol personal.
              </p>
              <span className="text-sm text-orange-600 font-semibold">Valor: €50</span>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow border-2 border-transparent hover:border-orange-300">
              <div className="text-3xl mb-4">📸</div>
              <h3 className="text-xl font-serif mb-3 text-orange-900">
                Galería Privada Premium
              </h3>
              <p className="text-orange-700 leading-relaxed">
                Fotos profesionales + vídeos 4K cada mes. Contenido exclusivo solo para ti.
              </p>
              <span className="text-sm text-orange-600 font-semibold">Valor: €120</span>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow border-2 border-transparent hover:border-orange-300">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-serif mb-3 text-orange-900">
                Certificado de Impacto
              </h3>
              <p className="text-orange-700 leading-relaxed">
                Informe detallado + certificado personalizado de tu contribución ecológica.
              </p>
              <span className="text-sm text-orange-600 font-semibold">Valor: €40</span>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow border-2 border-transparent hover:border-orange-300">
              <div className="text-3xl mb-4">🎁</div>
              <h3 className="text-xl font-serif mb-3 text-orange-900">
                Pack Gourmet Exclusivo
              </h3>
              <p className="text-orange-700 leading-relaxed">
                Aceite premium + almendras + productos artesanales. Enviado a tu puerta.
              </p>
              <span className="text-sm text-orange-600 font-semibold">Valor: €80</span>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="text-xl font-serif mb-3 text-orange-900">
                Prácticas regenerativas
              </h3>
              <p className="text-orange-700 leading-relaxed">
                Tu adopción apoya métodos que cuidan el suelo y la biodiversidad.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">💌</div>
              <h3 className="text-xl font-serif mb-3 text-orange-900">
                Opción de regalo
              </h3>
              <p className="text-orange-700 leading-relaxed">
                Adopta un árbol en nombre de alguien especial. Regalo único y significativo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif text-orange-900 mb-4 text-center">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-center text-orange-700 mb-12">
            ⭐⭐⭐⭐⭐ 4.9/5 basado en 500+ opiniones
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-orange-800 mb-4 italic">
                "Una experiencia única. Ver crecer mi olivo y recibir el aceite fue increíble. ¡100% recomendado!"
              </p>
              <p className="text-sm font-semibold text-orange-900">- María G.</p>
              <p className="text-xs text-orange-600">Olivo adoptado hace 8 meses</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-orange-800 mb-4 italic">
                "El mejor regalo que he hecho. Mi madre está encantada con su almendro y las fotos que recibe cada mes."
              </p>
              <p className="text-sm font-semibold text-orange-900">- Carlos R.</p>
              <p className="text-xs text-orange-600">Almendro regalado hace 6 meses</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-orange-800 mb-4 italic">
                "Visitamos nuestro árbol el mes pasado. Fue emocionante verlo en persona. El pack gourmet es de primera."
              </p>
              <p className="text-sm font-semibold text-orange-900">- Ana & Luis T.</p>
              <p className="text-xs text-orange-600">Olivo adoptado hace 1 año</p>
            </div>
          </div>
        </div>
      </section>

      {/* Garantías Section */}
      <section className="py-16 px-6 bg-orange-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif text-orange-900 mb-10 text-center">
            Nuestra Garantía para Ti
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-semibold mb-2">Pago Seguro</h3>
              <p className="text-sm text-orange-700">Cifrado SSL + Stripe</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-semibold mb-2">100% Satisfacción</h3>
              <p className="text-sm text-orange-700">O devolvemos tu dinero</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="font-semibold mb-2">Envío Gratis</h3>
              <p className="text-sm text-orange-700">A toda España</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-semibold mb-2">Soporte 24/7</h3>
              <p className="text-sm text-orange-700">Siempre disponibles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-orange-900 mb-4 text-center">
            Elige Tu Paquete
          </h2>
          <p className="text-center text-amber-600 font-semibold mb-12 text-lg">
            🔥 Oferta Limitada · Plazas Agotándose
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="border-2 border-orange-200 p-8 rounded-lg hover:border-orange-500 transition-all hover:shadow-xl relative">
              <div className="absolute -top-3 right-4 bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                MÁS VENDIDO
              </div>
              <h3 className="text-2xl font-serif mb-2 text-orange-900">
                🫒 Paquete Olivo Premium
              </h3>
              <p className="text-sm text-orange-600 mb-4">Árboles centenarios exclusivos</p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-orange-800">€120</span>
                <span className="text-orange-600">/año</span>
              </div>
              <div className="text-xs text-orange-700 mb-6 line-through">Valor real: €290</div>
              <ul className="text-sm space-y-2 mb-6 text-orange-800">
                <li>✓ Árbol olivo centenario</li>
                <li>✓ Aceite premium incluido</li>
                <li>✓ Acceso GPS exclusivo</li>
                <li>✓ Galería privada VIP</li>
              </ul>
              <Link 
                href="/adopt?type=olive"
                className="block text-center bg-gradient-to-r from-orange-600 to-orange-800 text-white px-6 py-4 rounded-full hover:shadow-lg transition-all font-bold text-lg"
              >
                ADOPTAR AHORA →
              </Link>
              <p className="text-xs text-center text-orange-600 mt-3">Solo quedan 8 olivos</p>
            </div>

            <div className="border-2 border-orange-200 p-8 rounded-lg hover:border-orange-500 transition-all hover:shadow-xl">
              <h3 className="text-2xl font-serif mb-2 text-orange-900">
                🌸 Paquete Almendro Primavera
              </h3>
              <p className="text-sm text-orange-600 mb-4">Ideal para regalar</p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-orange-800">€100</span>
                <span className="text-orange-600">/año</span>
              </div>
              <div className="text-xs text-orange-700 mb-6 line-through">Valor real: €240</div>
              <ul className="text-sm space-y-2 mb-6 text-orange-800">
                <li>✓ Almendro en floración</li>
                <li>✓ Almendras gourmet</li>
                <li>✓ Acceso GPS exclusivo</li>
                <li>✓ Fotos + vídeos HD</li>
              </ul>
              <Link 
                href="/adopt?type=almond"
                className="block text-center bg-orange-600 text-white px-6 py-4 rounded-full hover:bg-orange-800 transition-all font-bold text-lg"
              >
                ADOPTAR AHORA →
              </Link>
              <p className="text-xs text-center text-orange-600 mt-3">Quedan 7 almendros</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-amber-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-orange-900 mb-4">
            ¡No Te Quedes Sin Tu Árbol!
          </h2>
          <p className="text-xl text-amber-600 font-bold mb-6">
            ⏰ Solo quedan 15 árboles disponibles esta temporada
          </p>
          <p className="text-lg text-orange-800 mb-8 leading-relaxed">
            Más de 500 personas ya tienen su árbol. Únete a la comunidad Joyland 
            y recibe tu paquete premium completo en menos de 3 minutos.
          </p>
          <Link 
            href="/adopt"
            className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-16 py-6 rounded-full hover:shadow-2xl transition-all transform hover:scale-105 text-xl font-bold mb-4"
          >
            ADOPTAR MI ÁRBOL AHORA →
          </Link>
          <p className="text-sm text-orange-700">
            ✓ Pago 100% seguro · ✓ Satisfacción garantizada · ✓ Envío gratis
          </p>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-orange-700">
            <div>⭐⭐⭐⭐⭐ 4.9/5</div>
            <div>💳 Pago seguro</div>
            <div>📦 Envío incluido</div>
          </div>
        </div>
      </section>
    </div>
  )
}
