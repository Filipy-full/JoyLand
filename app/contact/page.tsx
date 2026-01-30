
'use client'
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

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
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }
      ])
      if (!error) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
        setErrorMessage('There was an error sending your message. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Connection error. Please check your internet connection.')
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-gray-800 mb-4 text-center">
          Contact
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Do you have questions? Want to know more about Joyland? Write to us.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">


              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Your name"
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
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="What do you want to talk about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Tell us..."
                />
              </div>

              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  Message sent successfully! We will reply soon.
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
                {status === 'sending' ? 'Sending...' : 'Send message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <div className="bg-sage-50 p-8 rounded-lg mb-6">
              <h2 className="text-2xl font-serif mb-4 text-gray-800">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Email</h3>
                    <a href="mailto:joylandspain@gmail.com?subject=JoyLand%20Contact%20Request" className="text-sage-600 hover:text-sage-700">
                      joylandspain@gmail.com
                  </a>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Location</h3>
                  <p className="text-gray-600">
                    Northern Spain<br />
                    (Exact location is shared with adopters)
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Response time</h3>
                  <p className="text-gray-600">
                    We reply within 24-48 hours<br />
                    (except weekends and holidays)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-lg">
              <h3 className="text-xl font-serif mb-3 text-gray-800">
                Frequently Asked Questions
              </h3>
              <p className="text-gray-600 mb-4">
                Before writing to us, we recommend checking our FAQ section. Your question may already be answered there.
              </p>
              <a
                href="/faq"
                className="inline-block text-sage-600 hover:text-sage-700 font-medium"
              >
                See FAQs →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-sage-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-serif text-gray-800 mb-4">
            Ready to adopt?
          </h2>
          <p className="text-gray-700 mb-6">
            You don’t need to contact us to adopt a tree. You can do it directly from the map.
          </p>
          <a
            href="/adopt"
            className="inline-block bg-sage-600 text-white px-8 py-3 rounded-full hover:bg-sage-700 transition-colors"
          >
            See available trees
          </a>
        </div>
      </div>
    </div>
  )
}
