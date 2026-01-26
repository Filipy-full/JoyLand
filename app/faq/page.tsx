export default function FAQPage() {
  const faqs = [
    {
      question: '¿Qué significa adoptar un árbol?',
      answer: 'Adoptar un árbol significa apoyar su cuidado durante un año completo. No te conviertes en propietario legal del árbol, pero sí en su "padrino" o "madrina". Recibes acceso exclusivo a información sobre tu árbol, su ubicación exacta en el mapa, actualizaciones con fotos y vídeos, un informe anual, y una giftbox de temporada.'
    },
    {
      question: '¿Es simbólico o real?',
      answer: 'Es completamente real. Tu adopción financia directamente el cuidado y mantenimiento de ese árbol específico. Conocerás su ubicación exacta en el mapa, podrás visitarlo cuando quieras, y verás fotos y vídeos reales de tu árbol a lo largo del año. No hay árboles ficticios ni simbólicos en Joyland.'
    },
    {
      question: '¿Puedo visitar mi árbol?',
      answer: 'Sí, absolutamente. Cuando adoptas un árbol, recibes sus coordenadas exactas. Puedes visitarlo cuando quieras (respetando la propiedad y avisando con antelación). Nos encanta cuando las personas vienen a conocer a su árbol en persona.'
    },
    {
      question: '¿Qué pasa después de un año?',
      answer: 'Después de un año, tu adopción termina y el árbol vuelve a estar disponible para una nueva adopción. Si quieres renovar tu adopción del mismo árbol, tendrás prioridad sobre nuevos adoptantes. También puedes optar por adoptar un árbol diferente cada año.'
    },
    {
      question: '¿Puedo nombrar mi árbol?',
      answer: 'Sí, durante el proceso de adopción puedes elegir un nombre para tu árbol. Este nombre aparecerá en el mapa y en la página del árbol durante el año de tu adopción. Cuando la adopción termine, el nombre se mantiene en el historial, pero el nuevo adoptante puede elegir un nuevo nombre.'
    },
    {
      question: '¿Puedo regalar una adopción?',
      answer: 'Sí, la adopción de un árbol es un regalo único y significativo. Durante el proceso de checkout puedes marcar que es un regalo y añadir un mensaje personal. El destinatario recibirá toda la información sobre su árbol.'
    },
    {
      question: '¿Qué incluye la giftbox de temporada?',
      answer: 'La giftbox varía según la temporada y lo que la tierra nos dé. Puede incluir aceite de oliva, almendras, miel local, hierbas aromáticas, y otros productos del terreno o de productores cercanos que compartimos valores. No siempre es lo mismo, porque dependemos de los ritmos naturales.'
    },
    {
      question: '¿Recibiré aceite o almendras de mi árbol específico?',
      answer: 'No necesariamente de tu árbol específico, ya que la producción de cada árbol varía mucho año a año. Los productos de la giftbox provienen de la producción general de Joyland. Tu adopción apoya todo el ecosistema, no solo un árbol aislado.'
    },
    {
      question: '¿Qué es agricultura regenerativa?',
      answer: 'Es un enfoque agrícola que va más allá de la sostenibilidad. No solo se trata de "no hacer daño", sino de mejorar activamente la salud del suelo, aumentar la biodiversidad, capturar carbono, y restaurar el ecosistema. Usamos prácticas como compostaje, cubiertas vegetales, cero químicos, y trabajo manual cuidadoso.'
    },
    {
      question: '¿Cuántos árboles hay en Joyland?',
      answer: 'Joyland es un proyecto pequeño. Tenemos aproximadamente 50 olivos y 30 almendros. No queremos crecer demasiado rápido. Preferimos mantener la calidad del cuidado y la conexión personal con cada árbol y cada adoptante.'
    },
    {
      question: '¿Con qué frecuencia recibiré actualizaciones?',
      answer: 'Subimos fotos y vídeos cada 2-3 meses aproximadamente, siguiendo las estaciones. En primavera verás la floración, en verano el crecimiento, en otoño la cosecha, en invierno el descanso. No es algo rígido ni programado, fluye con lo que pasa en la tierra.'
    },
    {
      question: '¿Puedo adoptar más de un árbol?',
      answer: 'Sí, puedes adoptar tantos árboles como quieras. Cada adopción es independiente, con su propia página, actualizaciones, y giftbox.'
    },
    {
      question: '¿Los pagos son seguros?',
      answer: 'Sí, todos los pagos se procesan a través de Stripe, una plataforma de pago reconocida mundialmente y completamente segura. Joyland nunca tiene acceso a tus datos bancarios.'
    },
    {
      question: '¿Puedo cancelar mi adopción?',
      answer: 'Las adopciones son por un año completo y no son reembolsables, ya que el dinero se destina inmediatamente al cuidado del árbol y la tierra. Sin embargo, si hay circunstancias excepcionales, contáctanos y veremos qué podemos hacer.'
    },
    {
      question: '¿Dónde está exactamente Joyland?',
      answer: 'Estamos en el norte de España, en una zona rural tranquila. La ubicación exacta se comparte con los adoptantes. Valoramos la privacidad del terreno mientras mantenemos la transparencia total con quienes forman parte de este proyecto.'
    },
  ]

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-gray-800 mb-4 text-center">
          Preguntas frecuentes
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Todo lo que necesitas saber sobre adoptar un árbol en Joyland
        </p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-sage-300 transition-colors">
              <h2 className="text-xl font-serif text-gray-800 mb-3">
                {faq.question}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-sage-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-serif text-gray-800 mb-4">
            ¿Tienes más preguntas?
          </h2>
          <p className="text-gray-700 mb-6">
            Estamos aquí para ayudarte. No dudes en contactarnos.
          </p>
          <a
            href="/contact"
            className="inline-block bg-sage-600 text-white px-8 py-3 rounded-full hover:bg-sage-700 transition-colors"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </div>
  )
}
