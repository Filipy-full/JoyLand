export default function FAQPage() {
  const faqs = [
    {
      question: 'IMPACT — How your support shapes Joyland',
      answer: `Tree adoption at Joyland supports the land as a living system — an ecology where each part works together to harmonise the whole.\n\nYour yearly contribution allows time, care, and continuity: the conditions needed for soil to regenerate, biodiversity to return, and trees to be tended according to their natural rhythm. Everything on this page reflects what your support makes possible — from groundcover and insects to hand harvesting, fresh oil, and ongoing observation of the land.\n\nWhat follows is a living process, shaped season by season, tree by tree.`
    },
    {
      question: 'The land today',
      answer: `Joyland shows what becomes possible when nature is given space to establish on its own strength, building resilience over time.\n\nWhat was once bare clay now carries living groundcover. Flowers rise and return each year. Insects move through the grove for longer periods across the seasons. Summer hums with crickets throughout the day, while mornings and evenings bring softer light, humidity, and the sound of frogs. Spring fills the land with birdsong; winter arrives quietly, wrapped in mist, with rosemary and calendula still flowering well into January.\n\nEach season leaves a visible trace — in soil texture, plant diversity, moisture retention, and the way the land holds life.`
    },
    {
      question: 'Natural succession in motion',
      answer: `Succession accelerated quickly once space and support were present.\n\nOrganic matter remained on the land. Hay was spread in selected areas. Pioneer plants arrived first — amaranth, thistles, rockets, bur clover — followed by fennel, wild carrots, and other self-seeding species. Hay-supported areas produced abundant calendula and chamomile. Cooler, shaded zones welcomed lamiums and perennial clovers, laying foundations for long-term groundcover.\n\nOver the past year, a wide range of seeds were introduced to expand diversity: oregano, borage, wild sages, cornflower, poppies, St John’s wort, valerian, and more. Each spring reveals what the land chooses to carry forward.\n\nA compost heap tailored to olive tree needs now returns nutrients to the soil in a slow, circular system.\n\nSuccession here unfolds through plants, roots, and soil — building structure and fertility over time.`
    },
    {
      question: 'Groundcover, soil health & water retention',
      answer: `Groundcover reshapes the land from the ground up.\n\nLiving cover allows water to penetrate deeper into clay soil, supports organic matter buildup, and encourages microbial and bacterial life, while attracting beneficial biodiversity. Roots move freely through soil that becomes softer and more structured over time.\n\nEstablished olive and almond trees benefit directly from this process. As plants complete their life cycle, they return organic matter to the soil, strengthening fertility year after year.`
    },
    {
      question: 'Biodiversity returning',
      answer: `As habitat strengthens, animal life responds.\n\nAnts, beetles, bees, wasps, and butterflies shape daily rhythms in the grove. Ants garden continuously — moving seeds, aerating soil, and improving water infiltration. Pollinators concentrate around flowering periods, creating dense moments of activity.\n\nBirds, mammals, and reptiles move freely through the unfenced land. Deer, hare, foxes, wild boar, and jackals contribute to soil structure and seed dispersal. Lizards and snakes warm themselves on stone terraces.\n\nBiodiversity emerges as a response to shelter, food, and continuity.`
    },
    {
      question: 'Trees, rhythm, and care',
      answer: `Your support allows trees to be cared for individually.\n\nEach tree is observed and tended according to its rhythm — balancing canopy, shade, airflow, and long-term health. Olive trees thrive with layered protection, while almond trees receive adjusted care as groundcover strengthens across the land.\n\nSome years focus on fruit, others on growth and recovery. Stewardship adapts continuously, guided by what the trees communicate.`
    },
    {
      question: 'Harvesting at human scale',
      answer: `Harvesting reflects the size and nature of the grove.\n\nSmaller trees are harvested by hand. Larger trees are worked with manual or small electric tools. Harvested olives move immediately into shaded storage, layered carefully, and transported to the mill within a narrow time window.\n\nMultiple passes support the quality and logistics of a small grove. Small-batch production keeps attention present at every step — from tree to pressing.`
    },
    {
      question: 'Fresh oil, unfiltered',
      answer: `Joyland olive oil is pressed fresh and left unfiltered.\n\nThis preserves the olive’s active compounds — polyphenols, antioxidants, and aromatic elements — resulting in a vibrant, expressive oil shaped by the harvest moment. Time is used carefully, allowing quality to remain intact.\n\nPatience extends beyond oil into infusions, curing, and product making across the land.`
    },
    {
      question: 'Where your contribution goes',
      answer: `Tree adoption directly supports: tree care, pruning, and observation; manual harvesting and soil-friendly tools; seeds, compost, and regenerative experiments; artisanal giftboxes shaped by the land’s offerings; transport connecting grove and city; lab testing for product quality and ecological insight; water support when trees need it; time for field observation and planning.\n\nJoyland also functions as experimental ground, where regeneration is observed, tracked, and refined.`
    },
    {
      question: 'Joyland this year',
      answer: `This year revealed clear patterns.\n\nLayered vegetation supported olive trees. Groundcover strengthened soil structure. Ant activity increased aeration and seed movement. Areas opened by wild boar allowed plant life to establish quickly.\n\nWhen flowers bloomed, the land buzzed continuously. Tall grasses revealed animal resting places during early morning walks.\n\nThe land communicated through growth, sound, and movement.`
    },
    {
      question: 'A living process',
      answer: `Your support sustains an unfolding system.\n\nSoil builds over time. Biodiversity responds when space is created. Trees thrive with care that respects timing. Agriculture becomes collaboration rather than extraction.\n\nEach adopted tree actively supports this living process, season after season.`
    },
    {
      question: 'How do I adopt a tree?',
      answer: `Click the button below to adopt a tree and become part of this living process.`
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
