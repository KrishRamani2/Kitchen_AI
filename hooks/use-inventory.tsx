"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type InventoryItem = {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  expiryDate?: string
}

type InventoryContextType = {
  inventory: InventoryItem[]
  addItem: (item: InventoryItem) => void
  updateItem: (item: InventoryItem) => void
  removeItem: (id: string) => void
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

// Sample inventory data
const sampleInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Tomatoes",
    quantity: 5,
    unit: "pcs",
    category: "produce",
  },
  {
    id: "2",
    name: "Chicken Breast",
    quantity: 500,
    unit: "g",
    category: "meat",
    expiryDate: "2025-06-10",
  },
  {
    id: "3",
    name: "Rice",
    quantity: 2,
    unit: "kg",
    category: "grains",
  },
  {
    id: "4",
    name: "Olive Oil",
    quantity: 500,
    unit: "ml",
    category: "other",
  },
  {
    id: "5",
    name: "Garlic",
    quantity: 3,
    unit: "pcs",
    category: "produce",
  },
  {
    id: "6",
    name: "Salt",
    quantity: 200,
    unit: "g",
    category: "spices",
  },
  {
    id: "7",
    name: "Pepper",
    quantity: 100,
    unit: "g",
    category: "spices",
  },
  {
    id: "8",
    name: "Onions",
    quantity: 4,
    unit: "pcs",
    category: "produce",
  },
]

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([])

  // Load inventory from localStorage on mount
  useEffect(() => {
    const savedInventory = localStorage.getItem("Cheffy_inventory")
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    } else {
      // Use sample data for demo
      setInventory(sampleInventory)
    }
  }, [])

  // Save inventory to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("Cheffy_inventory", JSON.stringify(inventory))
  }, [inventory])

  const addItem = (item: InventoryItem) => {
    setInventory((prev) => [...prev, item])
  }

  const updateItem = (item: InventoryItem) => {
    setInventory((prev) => prev.map((i) => (i.id === item.id ? item : i)))
  }

  const removeItem = (id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <InventoryContext.Provider value={{ inventory, addItem, updateItem, removeItem }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}
