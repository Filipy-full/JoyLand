
'use client'
import React, { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
        setErrorMessage('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Error de conexión. Por favor, verifica tu conexión a internet.')
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-gray-800 mb-4 text-center">
          Contacto
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          ¿Tienes preguntas? ¿Quieres saber más sobre Joyland? Escríbenos.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="¿De qué quieres hablar?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Cuéntanos..."
                />
              </div>

              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  ¡Mensaje enviado con éxito! Te responderemos pronto.
                </div>
              )}

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-sage-600 text-white px-8 py-4 rounded-full hover:bg-sage-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <div className="bg-sage-50 p-8 rounded-lg mb-6">
              <h2 className="text-2xl font-serif mb-4 text-gray-800">
                Información de contacto
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Email</h3>
                  <a href="mailto:info@joyland.es" className="text-sage-600 hover:text-sage-700">
                    info@joyland.es
                  </a>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Ubicación</h3>
                  <p className="text-gray-600">
                    Norte de España<br />
                    (La ubicación exacta se comparte con los adoptantes)
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Horario de respuesta</h3>
                  <p className="text-gray-600">
                    Respondemos en 24-48 horas<br />
                    (excepto fines de semana y festivos)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-lg">
              <h3 className="text-xl font-serif mb-3 text-gray-800">
                Preguntas frecuentes
              </h3>
              <p className="text-gray-600 mb-4">
                Antes de escribirnos, te recomendamos revisar nuestra sección de 
                preguntas frecuentes. Es posible que tu duda ya esté respondida allí.
              </p>
              <a
                href="/faq"
                className="inline-block text-sage-600 hover:text-sage-700 font-medium"
              >
                Ver preguntas frecuentes →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-sage-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-serif text-gray-800 mb-4">
            ¿Listo para adoptar?
          </h2>
          <p className="text-gray-700 mb-6">
            No necesitas contactarnos para adoptar un árbol. Puedes hacerlo directamente 
            desde el mapa.
          </p>
          <a
            href="/adopt"
            className="inline-block bg-sage-600 text-white px-8 py-3 rounded-full hover:bg-sage-700 transition-colors"
          >
            Ver árboles disponibles
          </a>
        </div>
      </div>
    </div>
  )
}
