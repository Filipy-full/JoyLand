"use client"
import Image from 'next/image'
import { useState } from 'react'

import Giftbox3D from './Giftbox3D'

export default function GiftboxPage() {
  const [modalImg, setModalImg] = useState<string|null>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const handleImgClick = (src: string) => {
    if (isMobile) setModalImg(src)
  }

  const handleCloseModal = () => setModalImg(null)

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-sage-700 mb-8 text-center">
          The Joyland Giftbox
        </h1>

        {/* Giftbox 3D animado e slider */}
        <div className="mb-12">
          <Giftbox3D />
        </div>

        {/* Modal para imagem em tela cheia no mobile */}
        {modalImg && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={handleCloseModal}>
            <Image
              src={modalImg}
              alt="Gift Fullscreen"
              fill
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              style={{ objectFit: 'contain' }}
              loading="lazy"
            />
            <button className="absolute top-4 right-4 text-white text-3xl font-bold" onClick={handleCloseModal}>&times;</button>
          </div>
        )}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border-2 border-sage-200 p-6 rounded-lg flex flex-col h-full">
              <div className="mb-3 flex justify-center">
                <Image
                  src="/rama-oliva.png"
                  alt="Olive branch"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain mb-3"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-serif mb-3 text-sage-700 text-center">
                Joyland’s Olive Oil
              </h3>
              <p className="text-sage-700 leading-relaxed text-center flex-1">
                Cold-pressed from our own olive trees, bottled to preserve oil’s flavour & quality.
              </p>
            </div>
            <div className="border-2 border-sage-200 p-6 rounded-lg flex flex-col h-full">
              <div className="mb-3 flex justify-center">
                <Image
                  src="/emoji/emoji_almendra.webp"
                  alt="Almond emoji"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                  style={{fontSize: '2.25rem'}} 
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-serif mb-3 text-sage-700 text-center">
                Almonds
              </h3>
              <p className="text-sage-700 leading-relaxed text-center flex-1">
                Bag of raw almonds in shell. From almond trees that bloom every spring, filling the valley with white and pink.
              </p>
            </div>
            <div className="border-2 border-sage-200 p-6 rounded-lg flex flex-col h-full">
              <div className="text-4xl mb-3 text-center">🌿</div>
              <h3 className="text-xl font-serif mb-3 text-sage-700 text-center">
                Aromatic Herbal Bouquet
              </h3>
              <p className="text-sage-700 leading-relaxed text-center flex-1">
                Rosemary, thyme, lavender, oregano, or sage. Growing wild among the trees. Slow-dried with care.
              </p>
            </div>
            <div className="border-2 border-sage-200 p-6 rounded-lg flex flex-col h-full">
              <div className="text-4xl mb-3 text-center">🎨​</div>
              <h3 className="text-xl font-serif mb-3 text-sage-700 text-center">
                Creative Surprises from Nature
              </h3>
              <p className="text-sage-700 leading-relaxed text-center flex-1">
                Handicrafts shaped by nature’s bounty — <span className="italic">herbal oil infusions, vinegar blends, dried flower products, soaps, luffas, steam blends, smudgesticks, seed bags</span>, you name it. We ignite when inspiration strikes. Each piece reflects the creativity and warmth of our community, made with intention and heart.
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
            Excited for your Giftbox?
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
        <div className="flex flex-row justify-center items-center gap-4 mb-12 mt-12">
          <div className="w-[230px] h-[250px] md:w-[420px] md:h-[520px] cursor-pointer" onClick={() => handleImgClick('/gift/gift-1.jpeg')}>
            <Image
              src="/gift/gift-1.jpeg"
              alt="Gift 1"
              width={350}
              height={220}
              className="rounded-lg shadow-md object-cover w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
