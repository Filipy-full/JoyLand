'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TreeIcon, GiftIcon, LocationIcon, HeartIcon } from '@/components/Icons'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      category: 'About Adoption',
      icon: TreeIcon,
      questions: [
        {
          question: 'What does it mean to adopt a tree?',
          answer: `When you adopt a tree at Joyland, you become part of its story. It's not a financial investment, but an authentic connection with the land. Your annual contribution supports regenerative practices that care for the soil, protect biodiversity, and foster ecosystem resilience. You'll receive updates about your tree, seasonal photos, harvest products, and annual reports on its growth.`
        },
        {
          question: 'How much does it cost to adopt a tree?',
          answer: `Prices vary depending on the tree type and benefits included. You can see all available options on the adoption page. Each package includes annual updates, photos, access to your tree, and harvest products.`
        },
        {
          question: 'Can I visit my tree?',
          answer: `Of course! Once adopted, you'll have access to your tree's exact GPS coordinates. You can visit anytime for a walk, a real harvest, or simply to hug the tree you support. We encourage you to come and experience Joyland in person.`
        },
        {
          question: 'Which tree should I choose: olive or almond?',
          answer: `Both are magnificent. Olives produce cold-pressed extra virgin olive oil, while almond trees produce gourmet almonds. The choice depends on your personal preferences. Trees are cared for with the same dedication and attention, regardless of type.`
        }
      ]
    },
    {
      category: 'Products & Harvests',
      icon: GiftIcon,
      questions: [
        {
          question: 'What products will I receive?',
          answer: `You'll receive an annual gift box with artisanal products from the land: extra virgin olive oil, gourmet almonds, dried herbs, and other products derived from regenerative farming. Products vary depending on the harvest and tree type adopted.`
        },
        {
          question: 'When will I receive my tree\'s harvest?',
          answer: `Olive harvest typically occurs between October and January, depending on the climate. Almond harvest is between August and September. After harvest, products are artisanally processed and sent to adopters within the first few weeks.`
        },
        {
          question: 'How are products processed and shipped?',
          answer: `Our products are processed artisanally while respecting natural rhythms. Olives are pressed fresh, unfiltered, to preserve active compounds. Everything is shipped in personalized gift boxes with photos and updates about your tree.`
        },
        {
          question: 'Can I visit during harvest?',
          answer: `Yes, we encourage you to participate! During harvest season, we organize workdays where adopters can come work with us, learn about the process, and celebrate the land's abundance.`
        }
      ]
    },
    {
      category: 'Logistics & Shipping',
      icon: LocationIcon,
      questions: [
        {
          question: 'What is Joyland\'s location?',
          answer: `Joyland is located in Sant Mateu de Bages, Catalunya, in the Catalan Geoparc. It spans 125,000 m² with 5 hectares of forest and 2 hectares of olive and almond grove on southeast and west-facing terraced land, at an altitude of 468-512m.`
        },
        {
          question: 'Where are products shipped?',
          answer: `We ship throughout Spain and select European countries. Shipping is included in your adoption. If you have questions about your specific location, contact us.`
        },
        {
          question: 'How long does the harvest take to arrive?',
          answer: `After harvest, artisanal processing takes a few weeks. Products are then shipped directly to your home. You'll receive shipping tracking and updates on your package status.`
        },
        {
          question: 'What are the visiting hours?',
          answer: `We're open from 11:00 to 21:00 o'clock. To organize a visit, we recommend contacting us in advance to ensure someone is available to receive you and guide you through the project.`
        }
      ]
    },
    {
      category: 'Sustainability & Impact',
      icon: HeartIcon,
      questions: [
        {
          question: 'How does my adoption contribute to regeneration?',
          answer: `Your annual contribution supports: tree care and observation, manual harvesting, seeds and compost, regenerative systems, artisanal gift boxes, transportation, quality testing, and time dedicated to research and planning. Everything is designed to strengthen the land as a living system.`
        },
        {
          question: 'What makes Joyland regenerative?',
          answer: `Joyland practices regenerative agriculture that works with nature, not against it. It includes soil management, living plant cover, protected biodiversity, observational practices, and small-scale attention. The goal is for the soil to be richer, biodiversity more abundant, and trees more resilient each year.`
        },
        {
          question: 'What biodiversity exists at Joyland?',
          answer: `Joyland harbors rich biodiversity. Ants, bees, butterflies, and other pollinators work continuously. Birds, mammals like deer, foxes, and wild boar, and even lizards and snakes live on the land. Biodiversity is a direct response to the care the soil receives and the space given to life.`
        },
        {
          question: 'Do I receive impact reports?',
          answer: `Yes. Each year you'll receive a detailed report on your tree's status and the broader ecosystem. It includes information on soil health, observed biodiversity, harvest, and how your contribution is creating positive impact on the land.`
        }
      ]
    },
    {
      category: 'Gift Adoption',
      icon: GiftIcon,
      questions: [
        {
          question: 'Can I gift a tree adoption?',
          answer: `Absolutely! Tree adoption is a unique and meaningful gift. It includes a personalized adoption certificate, regular updates, and harvest products. It's a beautiful way to connect someone you love with the land and regeneration.`
        },
        {
          question: 'How does the gift process work?',
          answer: `Select the tree and package you wish to gift, personalize the message and recipient's name, and we handle the rest. The recipient will receive all information about their tree and begin receiving updates immediately.`
        }
      ]
    },
    {
      category: 'General Questions',
      icon: TreeIcon,
      questions: [
        {
          question: 'Is there a minimum commitment?',
          answer: `We'd love a long-term relationship, but there's no minimum years requirement. However, we recommend at least one annual adoption so you can follow your tree's complete cycle from spring to harvest.`
        },
        {
          question: 'How do I contact Joyland if I have questions?',
          answer: `You can reach us through the contact page, by email at joylandspain@gmail.com, or visit us in person in Sant Mateu de Bages. We're available from 11:00 to 21:00 o'clock.`
        },
        {
          question: 'Can I make a donation in addition to adoption?',
          answer: `Yes. If you'd like to contribute beyond adoption, we'd love to hear from you. Contact us to explore other ways to support the project and its future vision.`
        },
        {
          question: 'Does Joyland organize events or gatherings?',
          answer: `Yes. We organize seasonal events, harvest workdays, educational gatherings, and celebrations with adopters. It's a wonderful way to connect with the Joyland community, learn about regeneration, and celebrate the land's cycles together.`
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-sage-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-sage-700 mb-6 drop-shadow-lg tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-sage-600 leading-relaxed">
            Everything you need to know about adopting a tree and joining the Joyland community
          </p>
          <div className="w-20 h-1 bg-sage-300 rounded-full mx-auto mt-6" />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-sage-100">
                  <category.icon className="w-6 h-6 text-sage-700" />
                </div>
                <h2 className="text-2xl font-serif text-sage-700 border-l-4 border-sage-400 pl-4">
                  {category.category}
                </h2>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 100 + questionIndex
                  const isOpen = openIndex === globalIndex

                  return (
                    <div
                      key={globalIndex}
                      className="bg-white rounded-2xl border border-sage-100 overflow-hidden hover:border-sage-300 hover:shadow-lg transition-all duration-300"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-sage-50 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-sage-800 text-left">
                          {faq.question}
                        </h3>
                        <svg
                          className={`w-6 h-6 text-sage-600 flex-shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </button>

                      {isOpen && (
                        <div className="px-6 py-4 bg-sage-50 border-t border-sage-100">
                          <p className="text-sage-800 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-sage-50 to-green-50 rounded-3xl p-8 md:p-12 border border-sage-200 text-center">
          <h2 className="text-3xl font-serif text-sage-700 mb-4">
            Still have questions?
          </h2>
          <p className="text-sage-600 mb-8 text-lg">
            We're here to help. Contact us directly if you need more information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/adopt"
              className="inline-block bg-sage-600 text-white px-8 py-3 rounded-full hover:bg-sage-700 transition-all transform hover:scale-105 font-bold"
            >
              Adopt a Tree
            </Link>
            <Link
              href="/contact"
              className="inline-block border-2 border-sage-600 text-sage-600 px-8 py-3 rounded-full hover:bg-sage-50 transition-colors font-bold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
