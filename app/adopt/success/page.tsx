import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  return (
    <div className="text-center">
      <div className="mb-8 text-7xl animate-bounce">🎉</div>
      <h1 className="text-4xl sm:text-5xl font-serif text-sage-900 mb-4">
        Welcome to Joyland!
      </h1>
      <p className="text-lg sm:text-xl text-sage-600 font-semibold mb-8 max-w-2xl mx-auto leading-relaxed">
        Your adoption was successful! You will receive a confirmation email in the next few minutes.
      </p>

      <div className="glass-card p-6 sm:p-8 rounded-3xl max-w-2xl mx-auto mb-8">
        <h2 className="text-xl sm:text-2xl font-serif mb-6 text-sage-900">
          📦 What happens next?
        </h2>
        <ul className="text-left space-y-4 text-sage-700 text-sm sm:text-base">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center text-sage-700 font-bold">1</span>
            <div>
              <strong>Confirmation email:</strong> You’ll receive all the details of your adoption
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center text-sage-700 font-bold">2</span>
            <div>
              <strong>Regular updates:</strong> We’ll keep you informed about your tree’s progress
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center text-sage-700 font-bold">3</span>
            <div>
              <strong>Seasonal giftbox:</strong> You’ll receive fresh products from the farm
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center text-sage-700 font-bold">4</span>
            <div>
              <strong>Annual report:</strong> A full summary of your adoption’s impact
            </div>
          </li>
        </ul>
      </div>


      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Link
          href="/"
          className="inline-block border-2 border-sage-600 text-sage-600 px-8 py-4 rounded-full hover:bg-sage-50 transition-all font-medium text-sm sm:text-base"
        >
          Back to home
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-sage-200 max-w-2xl mx-auto">
        <p className="text-center text-sage-600 mb-4 text-sm sm:text-base">Join our community:</p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <a href="https://www.instagram.com/chiara.abell.joyland/" target="_blank" rel="noopener noreferrer" className="text-sage-600 hover:text-sage-800 transition-colors">
            📷 Instagram
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-sage-600 hover:text-sage-800 transition-colors">
            📘 Facebook
          </a>
          <a href="/contact" className="text-sage-600 hover:text-sage-800 transition-colors">
            ✉️ Contact
          </a>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-50">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-sage-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-sage-600">Loading...</p>
            </div>
          }>
            <SuccessContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
