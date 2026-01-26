import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sage-100/50 to-white" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif text-gray-800 mb-6 leading-tight">
            Adopta un árbol en Joyland 🌿
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Un pequeño olivar y almendral regenerativo en el norte de España
          </p>
          <Link 
            href="/adopt"
            className="inline-block bg-sage-600 text-white px-10 py-4 rounded-full hover:bg-sage-700 transition-all transform hover:scale-105 text-lg font-medium"
          >
            Adoptar un árbol
          </Link>
        </div>
      </section>

      {/* What is Joyland Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-gray-800 mb-8 text-center">
            ¿Qué es Joyland?
          </h2>
          <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed space-y-4">
            <p>
              Joyland es un pequeño proyecto de regeneración en el norte de España. 
              Un olivar y almendral donde el tiempo se mueve despacio, donde cada árbol 
              tiene su historia y donde la naturaleza recupera su ritmo.
            </p>
            <p>
              No somos una gran explotación. Somos pequeños, lentos y honestos. 
              Aquí cada árbol importa, cada estación cuenta, y cada persona que adopta 
              un árbol se convierte en parte de esta historia.
            </p>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 px-6 bg-sage-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif text-gray-800 mb-12 text-center">
            Qué incluye la adopción
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="text-xl font-serif mb-3 text-gray-800">
                Tu árbol en el mapa
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Conoce la ubicación exacta de tu árbol. Puedes visitarlo cuando quieras.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">📸</div>
              <h3 className="text-xl font-serif mb-3 text-gray-800">
                Fotos y vídeos
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Actualizaciones visuales a lo largo del año. Ve cómo crece y cambia con las estaciones.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-serif mb-3 text-gray-800">
                Informe anual
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Un resumen del año: el árbol, la tierra, lo que ha pasado.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">🎁</div>
              <h3 className="text-xl font-serif mb-3 text-gray-800">
                Giftbox de temporada
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Un pequeño regalo con productos de la tierra cuando la temporada lo permite.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="text-xl font-serif mb-3 text-gray-800">
                Prácticas regenerativas
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tu adopción apoya métodos que cuidan el suelo y la biodiversidad.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">💌</div>
              <h3 className="text-xl font-serif mb-3 text-gray-800">
                Opción de regalo
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Adopta un árbol en nombre de alguien especial. Regalo único y significativo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-gray-800 mb-12 text-center">
            Árboles disponibles
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="border-2 border-sage-200 p-8 rounded-lg hover:border-sage-400 transition-colors">
              <h3 className="text-2xl font-serif mb-4 text-gray-800">
                Olivo
              </h3>
              <p className="text-gray-600 mb-6">
                Árboles centenarios que han visto pasar el tiempo. Resistentes, sabios, generosos.
              </p>
              <div className="text-3xl font-serif text-sage-700 mb-6">
                €120 / año
              </div>
              <Link 
                href="/adopt?type=olive"
                className="block text-center bg-sage-600 text-white px-6 py-3 rounded-full hover:bg-sage-700 transition-colors"
              >
                Adoptar un olivo
              </Link>
            </div>

            <div className="border-2 border-sage-200 p-8 rounded-lg hover:border-sage-400 transition-colors">
              <h3 className="text-2xl font-serif mb-4 text-gray-800">
                Almendro
              </h3>
              <p className="text-gray-600 mb-6">
                Los primeros en florecer. Delicados, resilientes, portadores de la primavera.
              </p>
              <div className="text-3xl font-serif text-sage-700 mb-6">
                €100 / año
              </div>
              <Link 
                href="/adopt?type=almond"
                className="block text-center bg-sage-600 text-white px-6 py-3 rounded-full hover:bg-sage-700 transition-colors"
              >
                Adoptar un almendro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-sage-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-serif text-gray-800 mb-6">
            Forma parte de Joyland
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Elige tu árbol en el mapa, dale un nombre, y comienza una relación de un año 
            con un pequeño rincón del norte de España.
          </p>
          <Link 
            href="/adopt"
            className="inline-block bg-sage-600 text-white px-10 py-4 rounded-full hover:bg-sage-700 transition-all transform hover:scale-105 text-lg font-medium"
          >
            Ver el mapa de árboles
          </Link>
        </div>
      </section>
    </div>
  )
}
