'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

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

  // Cargar del localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem('adoptionCart')
    if (saved) {
      try {
        let trees = JSON.parse(saved) as CartTree[]
        
        // Migrar precios antiguos: si son menores a 1000, multiplicar por 100
        trees = trees.map(tree => ({
          ...tree,
          price: tree.price < 1000 ? tree.price * 100 : tree.price
        }))
        
        setTrees(trees)
      } catch (e) {
        console.error('Error loading cart:', e)
      }
    }
    setMounted(true)
  }, [])

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('adoptionCart', JSON.stringify(trees))
    }
  }, [trees, mounted])

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
    localStorage.removeItem('adoptionCart')
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
