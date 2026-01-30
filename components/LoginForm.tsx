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
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-sage-700">{isRegister ? 'Create Account' : 'Login'}</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          {isRegister && (
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-sage-400" />
            </div>
          )}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-sage-400" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-sage-400" />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button type="submit" className="w-full bg-sage-600 text-white py-3 rounded-lg font-semibold hover:bg-sage-700 transition-colors" disabled={loading}>
            {loading ? (isRegister ? 'Creating...' : 'Logging in...') : (isRegister ? 'Create Account' : 'Login')}
          </button>
        </form>
        <div className="my-6 flex items-center justify-center">
          <span className="h-px bg-sage-200 flex-1" />
          <span className="px-4 text-gray-400 text-sm">or</span>
          <span className="h-px bg-sage-200 flex-1" />
        </div>
        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 bg-white border border-sage-400 text-sage-700 py-2 rounded-lg font-medium hover:bg-sage-50 transition-colors mb-2">
          <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.82 2.36 30.28 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.13 13.13 17.56 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.04l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M9.67 28.29c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C-1.13 17.18-1.13 30.82 1.69 39.24l7.98-6.2z"/><path fill="#EA4335" d="M24 46c6.28 0 11.56-2.08 15.41-5.66l-7.19-5.6c-2.01 1.35-4.6 2.16-8.22 2.16-6.44 0-11.87-3.63-14.33-8.79l-7.98 6.2C6.73 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Continue with Google
        </button>
        <div className="text-center mt-4">
          <button onClick={() => setIsRegister(!isRegister)} className="text-sage-600 hover:underline text-sm">
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  )
}
