import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-sage-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-sage-700 mb-6 drop-shadow-lg tracking-tight">
            About Joyland
          </h1>
          <div className="w-20 h-1 bg-sage-300 rounded-full mx-auto" />
        </div>

        {/* Images */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative h-[260px] md:h-[300px] rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src="/about/image1.jpeg"
              alt="Joyland landscape"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>

          <div className="relative h-[260px] md:h-[300px] rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src="/mapa/mapa.png"
              alt="Mapa de Joyland"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Physical Characteristics */}
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 border border-sage-100">
          <h2 className="text-3xl font-serif text-sage-700 mb-6 border-l-4 border-sage-400 pl-4">Physical Characteristics of Joyland</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl text-sage-600 mt-1">📍</span>
                <div>
                  <p className="font-semibold text-sage-700">Location</p>
                  <p className="text-sage-600">Geoparc Catalan</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl text-sage-600 mt-1">📏</span>
                <div>
                  <p className="font-semibold text-sage-700">Land Size</p>
                  <p className="text-sage-600">125,000 m²</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl text-sage-600 mt-1">⛰️</span>
                <div>
                  <p className="font-semibold text-sage-700">Altitude</p>
                  <p className="text-sage-600">468-512m</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl text-sage-600 mt-1">🌳</span>
                <div>
                  <p className="font-semibold text-sage-700">Joyland areas</p>
                  <p className="text-sage-600">1,5 ha olive & almond grove (SE), 4,8 ha terrace grove (W)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl text-sage-600 mt-1">🫒</span>
                <div>
                  <p className="font-semibold text-sage-700">Trees</p>
                  <p className="text-sage-600">~250 Arbequina olive trees</p>
                  <p className="text-sage-600">~200 almond trees</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl text-sage-600 mt-1">🏔️</span>
                <div>
                  <p className="font-semibold text-sage-700">Terrain</p>
                  <p className="text-sage-600">Valley with rocky clay soil</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How Joyland Came to Be */}
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 border border-sage-100">
          <h2 className="text-3xl font-serif text-sage-700 mb-6 border-l-4 border-sage-400 pl-4">How Joyland Came to Be</h2>
          <div className="space-y-6 text-sage-800 leading-relaxed">
            <p>The origins of Joyland reach back to an early childhood dream. When I was young my father envisioned a place in Spain. Over the years, that vision took many forms — agriculture, a retreat space, a place for community and creativity. I grew up sharing these imagined futures, returning to them from time to time.</p>
            
            <p>After my father passed away, I realised I was longing to reconnect with that long-held dream of a property in Spain. What began as a search gradually became a commitment to bringing his vision into form. Many properties were visited, yet none felt aligned until we were guided to this land by a double rainbow.</p>
            
            <p>From the moment of arrival, the landscape stood out through its openness, biodiversity, and the evident care of the former owners. The land felt established, alive, and ready to be celebrated in its potential.</p>
            
            <p>Although the property initially lay beyond our reach, steady effort and dedication made it possible. In 2023, the purchase was completed, and Joyland was born, named after my father Joy 🌈</p>
            
            <p>Transitioning from city life to working with the land brought a period of learning and adaptation. Over time, Joyland became a place of shared exploration, welcoming visits from friends and loved ones who contributed ideas, skills, and presence.</p>
            
            <p>Since then, the land has experienced its first olive harvest, a wedding and other shared celebrations, and the installation of essential systems such as solar energy and water filtration. Each step has contributed to shaping Joyland to what it is today.</p>
          </div>
        </div>

        {/* What Joyland Stands For */}
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 border border-sage-100">
          <h2 className="text-3xl font-serif text-sage-700 mb-6 border-l-4 border-sage-400 pl-4">What Joyland Stands For</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Stewardship of land over time',
              'Care for natural cycles',
              'Encouraging wild species',
              'Agriculture guided by observation',
              'Support for biodiversity',
              'Small-scale, attentive management',
              'Respect in living systems',
              'Creative connections'
            ].map((value, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-sage-50 rounded-lg">
                <svg className="w-5 h-5 text-sage-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sage-800 font-medium">{value}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sage-800 italic text-center">Joyland continues to develop through ongoing care, learning, and relationship with the land.</p>
        </div>

        {/* Future Visions */}
        <div className="bg-gradient-to-br from-sage-50 to-green-50 rounded-3xl shadow-2xl p-8 md:p-12 border border-sage-200">
          <h2 className="text-3xl font-serif text-sage-700 mb-6 border-l-4 border-sage-400 pl-4">Joyland Future Visions</h2>
          <div className="space-y-6 text-sage-800 leading-relaxed">
            <p>Our vision is to create a place where land stewardship, creativity, and shared learning come together. Future plans grow from what the land inspires and what emerges through collaboration.</p>
            
            <p className="text-lg">This may include:</p>
            <ul className="space-y-3 ml-6">
              <li className="flex gap-3">
                <span className="text-sage-600 text-xl">🌱</span>
                <span>Small community gardens</span>
              </li>
              <li className="flex gap-3">
                <span className="text-sage-600 text-xl">📚</span>
                <span>Educational gatherings</span>
              </li>
              <li className="flex gap-3">
                <span className="text-sage-600 text-xl">🏡</span>
                <span>Sleeping facilities for visitors</span>
              </li>
              <li className="flex gap-3">
                <span className="text-sage-600 text-xl">🎨</span>
                <span>Creative or nature-based activities that align with the rhythms of the landscape</span>
              </li>
            </ul>
            
            <p className="text-lg font-semibold text-sage-700 mt-8">Nature invites us to play, which we celebrate in every way.</p>
            <p className="text-center text-xl font-serif text-sage-700 mt-8">Welcome to Joyland.</p>
          </div>
        </div>

        <div className="bg-sage-100 p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-serif text-sage-800 mb-4">
            Adopt a tree. Support a vibrant grove rooted in care.
          </h2>
          <a
            href="/adopt"
            className="inline-block bg-sage-600 text-white px-8 py-3 rounded-full hover:bg-sage-700 transition-colors"
          >
            Adopt a tree. Support a vibrant grove rooted in care.
          </a>
        </div>

      </div>
    </div>
  );
}
