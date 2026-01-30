"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (isRegister) {
      // Registro
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      })
      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setError('Check your email to confirm your registration.')
        setLoading(false)
      }
    } else {
      // Login
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        router.push('/admin/messages')
      }
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-100 to-sage-300">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-sage-100 relative">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.jpeg" alt="Joyland Logo" className="w-16 h-16 rounded-full shadow-md mb-2 border-2 border-sage-200 bg-white object-cover" />
          <h2 className="text-3xl font-extrabold mb-1 text-sage-700 font-serif tracking-tight drop-shadow-sm">{isRegister ? 'Create Account' : 'Sign In'}</h2>
          <p className="text-sage-500 text-center text-base max-w-xs">Access the admin dashboard or manage your Joyland account.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          {isRegister && (
            <div>
              <label className="block mb-1 font-medium text-sage-700">Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.5-2.1 4.5-4.5S14.7 3 12 3 7.5 5.1 7.5 7.5 9.3 12 12 12zm0 2.25c-3 0-9 1.5-9 4.5V21h18v-2.25c0-3-6-4.5-9-4.5z"/></svg>
                </span>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-sage-400 transition-all" placeholder="Your name" />
              </div>
            </div>
          )}
          <div>
            <label className="block mb-1 font-medium text-sage-700">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" fill="none"/><path d="M22 6l-10 7L2 6"/></svg>
              </span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-sage-400 transition-all" placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium text-sage-700">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-sage-400 transition-all" placeholder="Your password" />
            </div>
          </div>
          {error && <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded py-2 px-3 animate-pulse">{error}</div>}
          <button type="submit" className="w-full bg-sage-600 text-white py-3 rounded-lg font-semibold hover:bg-sage-700 transition-colors shadow-md" disabled={loading}>
            {loading ? (isRegister ? 'Creating...' : 'Signing in...') : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        <div className="my-6 flex items-center justify-center">
          <span className="h-px bg-sage-200 flex-1" />
          <span className="px-4 text-gray-400 text-sm">or</span>
          <span className="h-px bg-sage-200 flex-1" />
        </div>
        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 bg-white border border-sage-400 text-sage-700 py-2 rounded-lg font-medium hover:bg-sage-50 transition-colors mb-2 shadow-sm">
          <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.82 2.36 30.28 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.13 13.13 17.56 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.04l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M9.67 28.29c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C-1.13 17.18-1.13 30.82 1.69 39.24l7.98-6.2z"/><path fill="#EA4335" d="M24 46c6.28 0 11.56-2.08 15.41-5.66l-7.19-5.6c-2.01 1.35-4.6 2.16-8.22 2.16-6.44 0-11.87-3.63-14.33-8.79l-7.98 6.2C6.73 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Continue with Google
        </button>
        <div className="text-center mt-4">
          <button onClick={() => setIsRegister(!isRegister)} className="text-sage-600 hover:underline text-sm">
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  )
}
