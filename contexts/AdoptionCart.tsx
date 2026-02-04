'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface CartTree {
  id: string
  name: string
  species: string
  type: 'olivo' | 'almendro'
  price: number
  area: string
  year: number
  customName?: string
}

interface AdoptionCartContextType {
  trees: CartTree[]
  addTree: (tree: CartTree) => void
  removeTree: (treeId: string) => void
  updateTreeCustomName: (treeId: string, customName: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTreeCount: () => number
}

const AdoptionCartContext = createContext<AdoptionCartContextType | undefined>(undefined)

export function AdoptionCartProvider({ children }: { children: React.ReactNode }) {
  const [trees, setTrees] = useState<CartTree[]>([])
  const [mounted, setMounted] = useState(false)
  const [storageKey, setStorageKey] = useState('adoptionCart:guest')

  const loadCart = (key: string) => {
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        let trees = JSON.parse(saved) as CartTree[]

        // Migrar precios antiguos: si son menores a 1000, multiplicar por 100
        trees = trees.map(tree => ({
          ...tree,
          price: tree.price < 1000 ? tree.price * 100 : tree.price
        }))

        setTrees(trees)
        return
      } catch (e) {
        console.error('Error loading cart:', e)
      }
    }
    setTrees([])
  }

  const mergeCarts = (base: CartTree[], incoming: CartTree[]) => {
    const map = new Map(base.map((t) => [t.id, t]))
    incoming.forEach((t) => {
      if (!map.has(t.id)) map.set(t.id, t)
    })
    return Array.from(map.values())
  }

  // Cargar del localStorage al montar y al cambiar de sesión
  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!isMounted) return
      const key = user?.id ? `adoptionCart:${user.id}` : 'adoptionCart:guest'
      setStorageKey(key)
      // Se já estiver logado, mesclar carrinho guest se existir
      if (user?.id) {
        const mergeFlagKey = `adoptionCart:guestMerged:${user.id}`
        const alreadyMerged = localStorage.getItem(mergeFlagKey) === 'true'
        const guestSaved = localStorage.getItem('adoptionCart:guest')
        if (!alreadyMerged && guestSaved) {
          const userSaved = localStorage.getItem(key)
          const guestTrees = guestSaved ? (JSON.parse(guestSaved) as CartTree[]) : []
          const userTrees = userSaved ? (JSON.parse(userSaved) as CartTree[]) : []
          const merged = mergeCarts(userTrees, guestTrees)
          localStorage.setItem(key, JSON.stringify(merged))
          localStorage.removeItem('adoptionCart:guest')
          localStorage.setItem(mergeFlagKey, 'true')
          setTrees(merged)
        } else {
          loadCart(key)
        }
      } else {
        loadCart(key)
      }
      setMounted(true)
    }

    init()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const key = session?.user?.id ? `adoptionCart:${session.user.id}` : 'adoptionCart:guest'
      setStorageKey(key)
      if (session?.user?.id) {
        const mergeFlagKey = `adoptionCart:guestMerged:${session.user.id}`
        const alreadyMerged = localStorage.getItem(mergeFlagKey) === 'true'
        const guestSaved = localStorage.getItem('adoptionCart:guest')
        if (!alreadyMerged && guestSaved) {
          const userSaved = localStorage.getItem(key)
          const guestTrees = guestSaved ? (JSON.parse(guestSaved) as CartTree[]) : []
          const userTrees = userSaved ? (JSON.parse(userSaved) as CartTree[]) : []
          const merged = mergeCarts(userTrees, guestTrees)
          localStorage.setItem(key, JSON.stringify(merged))
          localStorage.removeItem('adoptionCart:guest')
          localStorage.setItem(mergeFlagKey, 'true')
          setTrees(merged)
        } else {
          loadCart(key)
        }
      } else {
        loadCart(key)
      }
    })

    return () => {
      isMounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(storageKey, JSON.stringify(trees))
    }
  }, [trees, mounted, storageKey])

  const addTree = (tree: CartTree) => {
    setTrees((prev) => {
      const exists = prev.find((t) => t.id === tree.id)
      if (exists) {
        return prev
      }
      return [...prev, tree]
    })
  }

  const removeTree = (treeId: string) => {
    setTrees((prev) => prev.filter((t) => t.id !== treeId))
  }

  const updateTreeCustomName = (treeId: string, customName: string) => {
    setTrees((prev) =>
      prev.map((t) =>
        t.id === treeId ? { ...t, customName: customName || undefined } : t
      )
    )
  }

  const clearCart = () => {
    setTrees([])
    localStorage.removeItem(storageKey)
  }

  const getTotalPrice = () => {
    return trees.reduce((sum, tree) => sum + tree.price, 0)
  }

  const getTreeCount = () => {
    return trees.length
  }

  return (
    <AdoptionCartContext.Provider
      value={{
        trees,
        addTree,
        removeTree,
        updateTreeCustomName,
        clearCart,
        getTotalPrice,
        getTreeCount,
      }}
    >
      {children}
    </AdoptionCartContext.Provider>
  )
}

export function useAdoptionCart() {
  const context = useContext(AdoptionCartContext)
  if (!context) {
    throw new Error('useAdoptionCart must be used within AdoptionCartProvider')
  }
  return context
}
