export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-gray-800 mb-8 text-center">
          Sobre Joyland
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-serif text-gray-800 mb-4">La tierra</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Joyland es un pequeño proyecto en el norte de España. Un lugar donde conviven 
              olivos centenarios y almendros que florecen cada primavera. No es una gran finca, 
              no es industrial, no es rápido. Es pequeño, real y honesto.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Aquí el tiempo se mide en estaciones, no en cuartos fiscales. Cada árbol tiene 
              su personalidad, su historia, su lugar en el paisaje. Y queremos que conozcas 
              esa historia.
            </p>
          </section>

          <section className="mb-12 bg-sage-50 p-8 rounded-lg">
            <h2 className="text-3xl font-serif text-gray-800 mb-4">La filosofía</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Creemos en la regeneración, no en la explotación. En cuidar el suelo, no solo 
              en extraer de él. En la biodiversidad, en los ritmos naturales, en dar tiempo 
              a la tierra para recuperarse.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              No usamos químicos. No forzamos los ciclos. Trabajamos con lo que la naturaleza 
              nos da, cuando nos lo da. A veces eso significa menos cosecha. A veces significa 
              esperar. Siempre significa respeto.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Joyland no es perfecto. Estamos aprendiendo, experimentando, a veces fallando. 
              Pero siempre intentando hacerlo mejor, más consciente, más conectado con la tierra.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-gray-800 mb-4">Prácticas regenerativas</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-sage-200 p-6 rounded-lg">
                <h3 className="text-xl font-serif mb-3 text-gray-800">🌱 Salud del suelo</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Compostaje, cubiertas vegetales y rotación de cultivos para mantener 
                  el suelo vivo y fértil.
                </p>
              </div>
              
              <div className="border border-sage-200 p-6 rounded-lg">
                <h3 className="text-xl font-serif mb-3 text-gray-800">🐝 Biodiversidad</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Creamos hábitats para insectos, aves y vida silvestre. La diversidad 
                  es salud.
                </p>
              </div>
              
              <div className="border border-sage-200 p-6 rounded-lg">
                <h3 className="text-xl font-serif mb-3 text-gray-800">💧 Agua</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Riego eficiente y gestión responsable del agua. Cada gota cuenta.
                </p>
              </div>
              
              <div className="border border-sage-200 p-6 rounded-lg">
                <h3 className="text-xl font-serif mb-3 text-gray-800">🌿 Sin químicos</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cero pesticidas, cero herbicidas. Trabajo manual y paciencia.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-gray-800 mb-4">Tiempo, cuidado y continuidad</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Un árbol no se cuida en un día. Un ecosistema no se regenera en un mes. 
              Este trabajo requiere tiempo, atención constante y compromiso a largo plazo.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cuando adoptas un árbol, estás apoyando ese tiempo. Estás diciendo que te 
              importa lo que pasa en un pequeño rincón del norte de España. Que valoras 
              el trabajo lento y cuidadoso.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Y a cambio, te mantenemos conectado. Te mostramos lo que pasa. Las flores, 
              los frutos, las tormentas, los días de sol. La vida real de un árbol real.
            </p>
          </section>

          <section className="bg-sage-100 p-8 rounded-lg text-center">
            <h2 className="text-3xl font-serif text-gray-800 mb-4">
              ¿Quieres formar parte?
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Adopta un árbol y conecta con la tierra de una forma real y significativa.
            </p>
            <a
              href="/adopt"
              className="inline-block bg-sage-600 text-white px-10 py-4 rounded-full hover:bg-sage-700 transition-all transform hover:scale-105 text-lg font-medium"
            >
              Ver los árboles disponibles
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}
