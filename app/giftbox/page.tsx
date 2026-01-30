import Image from 'next/image'

export default function GiftboxPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-sage-700 mb-8 text-center">
          The Joyland Giftbox
        </h1>

        {/* Hero Image */}
        <div className="mb-12 relative h-96 rounded-lg overflow-hidden shadow-xl">
          <Image
            src="/giftbox.jpeg"
            alt="Joyland Giftbox"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="mb-12 text-center">
          <p className="text-xl text-sage-700 leading-relaxed max-w-3xl mx-auto">
            Each adoption includes a seasonal giftbox. The land surprises us each year with what is thriving when. 
          </p>
        </div>

        <section className="mb-12 bg-sage-50 p-8 rounded-lg border-l-4 border-sage-600">
          <h2 className="text-3xl font-serif text-sage-700 mb-4">
            What is the giftbox?
          </h2>
          <p className="text-sage-800 leading-relaxed mb-4">
            The giftbox is our way of sharing the fruits of Joyland with you. It’s a curated giftbox with products created from the land, sent after the olive harvest.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-serif text-sage-700 mb-6 text-center">
            What might be included
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <img src="/rama-oliva.png" alt="Olive branch" className="w-16 h-16 object-contain mr-4" />
                <h3 className="text-xl font-serif mb-3 text-sage-700">
                  Joyland’s Olive Oil
                </h3>
              </div>
              <p className="text-sage-700 leading-relaxed">
                Cold-pressed from our own olive trees, bottled to preserve oil’s flavour & quality.
              </p>
            </div>
            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🌰</div>
              <h3 className="text-xl font-serif mb-3 text-sage-700">
                Almonds
              </h3>
              <p className="text-sage-700 leading-relaxed">
                Bag of raw almonds in shell. From almond trees that bloom every spring, filling the valley with white and pink.
              </p>
            </div>
            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🍶</div>
              <h3 className="text-xl font-serif mb-3 text-sage-700">
                DIY Joyland Vinegar Blend
              </h3>
              <p className="text-sage-700 leading-relaxed">
                Bottled herbal blends from the land, to be infused at home with your favourite vinegar.
              </p>
            </div>
            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🌿</div>
              <h3 className="text-xl font-serif mb-3 text-sage-700">
                Aromatic Herbal Bouquet
              </h3>
              <p className="text-sage-700 leading-relaxed">
                Rosemary, thyme, lavender, oregano, or sage. Growing wild among the trees. Slow-dried with care.
              </p>
            </div>
            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🫙</div>
              <h3 className="text-xl font-serif mb-3 text-sage-700">
                Herbal Oil Infusion
              </h3>
              <p className="text-sage-700 leading-relaxed">
                Herbs slowly infused in our own olive oil and offered in a miniature bottle, perfect for culinary or wellness use. 
              </p>
            </div>
            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🧵</div>
              <h3 className="text-xl font-serif mb-3 text-sage-700">
                Creative Surprises from Nature
              </h3>
              <p className="text-sage-700 leading-relaxed">
                Handicrafts shaped by nature’s bounty — dried flower products, soaps, luffas, steam blends, smudgesticks, seed bags, you name it. We ignite when inspiration strikes. Each piece reflects the creativity and warmth of our community, made with intention and heart.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-white border border-gray-200 p-8 rounded-lg">
          <h2 className="text-3xl font-serif text-sage-700 mb-4">
            The nature of the season
          </h2>
          <p className="text-sage-800 leading-relaxed mb-4">
            A Joyland giftbox will contain different surprises each year. One year might bring an extraordinary almond harvest. Another, late frosts may reduce it. One year olives are plentiful, the next year the trees might not carry olives at all. 
          </p>
          <p className="text-sage-800 leading-relaxed mb-4">
            Nature has a different plan each year and we honour and value this wisdom. It’s a reminder that we are part of nature, and that it’s our job to figure out how to work together with nature in the best way. 
          </p>
          <p className="text-sage-800 leading-relaxed">
            Whenever your giftboxes are ready to be prepared, we’ll notify you so you know when to expect it and where to send it in case it’s a heartfelt gift for a loved one. 
          </p>
        </section>

        <section className="bg-sage-100 p-8 rounded-lg text-center">
          <h2 className="text-3xl font-serif text-sage-700 mb-4">
            Be part of this rhythm
          </h2>
          <p className="text-lg text-sage-800 mb-6">
            Adopt a tree and receive your giftbox when the season is ready.
          </p>
          <a
            href="/adopt"
            className="inline-block bg-sage-600 text-white px-10 py-4 rounded-full hover:bg-sage-700 transition-all transform hover:scale-105 text-lg font-medium"
          >
            Adopt a tree
          </a>
        </section>
      </div>
    </div>
  )
}
