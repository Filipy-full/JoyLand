export default function GiftboxPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-gray-800 mb-8 text-center">
          La Giftbox de Joyland
        </h1>

        <div className="mb-12 text-center">
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Cada adopción incluye una giftbox de temporada. No es algo estandarizado 
            ni predecible. Depende de lo que la tierra nos dé y cuándo nos lo dé.
          </p>
        </div>

        <section className="mb-12 bg-sage-50 p-8 rounded-lg">
          <h2 className="text-3xl font-serif text-gray-800 mb-4">
            ¿Qué es la giftbox?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            La giftbox es nuestra forma de compartir los frutos de Joyland contigo. 
            Es una caja que enviamos cuando la temporada está lista, no en una fecha 
            fija del calendario.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Puede llegar en primavera, en otoño, o en invierno. Puede ser después de 
            la cosecha de aceitunas, o cuando las almendras están listas, o cuando 
            tenemos miel de las colmenas cercanas. Fluye con los ritmos naturales.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-serif text-gray-800 mb-6 text-center">
            Qué puede incluir
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🫒</div>
              <h3 className="text-xl font-serif mb-3 text-gray-800">
                Aceite de oliva
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Prensado en frío, de nuestros olivos centenarios. Cada botella tiene 
                la historia de árboles que han visto pasar generaciones.
              </p>
            </div>

            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🌰</div>
              <h3 className="text-xl font-serif mb-3 text-gray-800">
                Almendras
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Crudas, tostadas, o en crema. De los almendros que florecen cada 
                primavera y llenan el valle de blanco y rosa.
              </p>
            </div>

            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🍯</div>
              <h3 className="text-xl font-serif mb-3 text-gray-800">
                Miel local
              </h3>
              <p className="text-gray-600 leading-relaxed">
                De apicultores cercanos que comparten nuestra filosofía. Las abejas 
                polinizan nuestros árboles, nosotros apoyamos su trabajo.
              </p>
            </div>

            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🌿</div>
              <h3 className="text-xl font-serif mb-3 text-gray-800">
                Hierbas aromáticas
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Romero, tomillo, lavanda. Crecen silvestres entre los árboles. 
                Secadas al sol, con paciencia.
              </p>
            </div>

            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🫙</div>
              <h3 className="text-xl font-serif mb-3 text-gray-800">
                Conservas caseras
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Mermeladas, chutneys, aceitunas curadas. Cuando hay excedente, 
                lo preservamos para compartir.
              </p>
            </div>

            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-xl font-serif mb-3 text-gray-800">
                Sorpresas locales
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Productos de artesanos y productores cercanos que admiramos. 
                Cerámica, textiles, pequeñas cosas bellas y honestas.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-white border border-gray-200 p-8 rounded-lg">
          <h2 className="text-3xl font-serif text-gray-800 mb-4">
            La naturaleza de temporada
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            No podemos prometer exactamente qué habrá en tu giftbox ni cuándo llegará. 
            Y eso es intencional.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Un año puede haber una cosecha de almendras extraordinaria. Otro año, 
            las heladas tardías pueden reducirla. El aceite puede estar listo en 
            noviembre o en enero, dependiendo de cuándo maduran las aceitunas.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Esto no es Amazon. No es predecible ni instantáneo. Y creemos que ahí 
            está su valor. Es un recordatorio de que dependemos de la naturaleza, 
            no al revés.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Tu giftbox llega cuando está lista. Y cuando llega, es auténtica.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-serif text-gray-800 mb-6 text-center">
            Ejemplos de giftboxes pasadas
          </h2>
          
          <div className="space-y-6">
            <div className="bg-sage-50 p-6 rounded-lg">
              <h3 className="text-xl font-serif mb-2 text-gray-800">
                Otoño 2025
              </h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                Aceite de oliva virgen extra (500ml), almendras tostadas con sal marina (200g), 
                miel de romero (250g), ramita de lavanda seca, y una pequeña lámina impresa 
                con la historia de la temporada.
              </p>
              <p className="text-sm text-gray-500">
                Enviada en diciembre, después de la cosecha de aceitunas
              </p>
            </div>

            <div className="bg-sage-50 p-6 rounded-lg">
              <h3 className="text-xl font-serif mb-2 text-gray-800">
                Primavera 2025
              </h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                Almendras crudas (300g), crema de almendras casera (150g), hierbas aromáticas 
                secas mixtas, una vela de cera de abeja hecha por un artesano local, y semillas 
                de flores silvestres para plantar.
              </p>
              <p className="text-sm text-gray-500">
                Enviada en mayo, durante la temporada de almendras
              </p>
            </div>

            <div className="bg-sage-50 p-6 rounded-lg">
              <h3 className="text-xl font-serif mb-2 text-gray-800">
                Invierno 2024
              </h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                Aceite de oliva nuevo (250ml), aceitunas curadas caseras (200g), mermelada 
                de membrillo artesanal, una pequeña pieza de cerámica local, y una carta 
                escrita a mano sobre el año en Joyland.
              </p>
              <p className="text-sm text-gray-500">
                Enviada en febrero, durante el invierno tranquilo
              </p>
            </div>
          </div>
        </section>

        <section className="bg-sage-100 p-8 rounded-lg text-center">
          <h2 className="text-3xl font-serif text-gray-800 mb-4">
            Forma parte de este ritmo
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Adopta un árbol y recibe tu giftbox cuando la temporada esté lista.
          </p>
          <a
            href="/adopt"
            className="inline-block bg-sage-600 text-white px-10 py-4 rounded-full hover:bg-sage-700 transition-all transform hover:scale-105 text-lg font-medium"
          >
            Adoptar un árbol
          </a>
        </section>
      </div>
    </div>
  )
}
