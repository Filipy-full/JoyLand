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
            Each adoption includes a seasonal giftbox. It’s not standardized or predictable. It depends on what the land gives us, and when.
          </p>
        </div>

        <section className="mb-12 bg-sage-50 p-8 rounded-lg border-l-4 border-sage-600">
          <h2 className="text-3xl font-serif text-sage-700 mb-4">
            What is the giftbox?
          </h2>
          <p className="text-sage-800 leading-relaxed mb-4">
            The giftbox is our way of sharing the fruits of Joyland with you. It’s a box we send when the season is ready, not on a fixed date.
          </p>
          <p className="text-sage-800 leading-relaxed">
            It may arrive in spring, autumn, or winter. Sometimes after the olive harvest, sometimes when the almonds are ready. It flows with natural rhythms.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-serif text-sage-700 mb-6 text-center">
            What might be included
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🫒</div>
              <h3 className="text-xl font-serif mb-3 text-sage-700">
                Olive Oil
              </h3>
              <p className="text-sage-700 leading-relaxed">
                Cold-pressed from our centuries-old olive trees. Each bottle carries the story of trees that have witnessed generations pass.
              </p>
            </div>

            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🌰</div>
              <h3 className="text-xl font-serif mb-3 text-sage-700">
                Almonds
              </h3>
              <p className="text-sage-700 leading-relaxed">
                Raw, roasted, or as a creamy spread. From almond trees that bloom every spring, filling the valley with white and pink.
              </p>
            </div>

            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🌿</div>
              <h3 className="text-xl font-serif mb-3 text-sage-700">
                Aromatic Herbs
              </h3>
              <p className="text-sage-700 leading-relaxed">
                Rosemary, thyme, lavender. Growing wild among the trees. Sun-dried, with patience and care.
              </p>
            </div>

            <div className="border-2 border-sage-200 p-6 rounded-lg">
              <div className="text-4xl mb-3">🧵</div>
              <h3 className="text-xl font-serif mb-3 text-sage-700">
                Handcrafted Touches
              </h3>
              <p className="text-sage-700 leading-relaxed">
                Creations shaped by local hands — ceramics, textiles, and small, honest objects. Each piece reflects the creativity and warmth of our community, made with intention and heart.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-white border border-gray-200 p-8 rounded-lg">
          <h2 className="text-3xl font-serif text-sage-700 mb-4">
            The nature of the season
          </h2>
          <p className="text-sage-800 leading-relaxed mb-4">
            We can’t promise exactly what will be in your giftbox or when it will arrive. And that’s intentional.
          </p>
          <p className="text-sage-800 leading-relaxed mb-4">
            One year might bring an extraordinary almond harvest. Another, late frosts may reduce it. The oil may be ready in November or in January, depending on when the olives ripen.
          </p>
          <p className="text-sage-800 leading-relaxed mb-4">
            This isn’t Amazon. It’s not predictable or instant. And we believe that’s its value. It’s a reminder that we depend on nature, not the other way around.
          </p>
          <p className="text-sage-800 leading-relaxed">
            Your giftbox arrives when it’s ready. And when it arrives, it’s genuine.
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
