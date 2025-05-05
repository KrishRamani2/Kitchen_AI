"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type RecipeIngredient = {
  name: string
  quantity: number
  unit: string
}

type RecipeStep = {
  title: string
  description: string
  timer?: number
}

type RecipeNutrition = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

type Recipe = {
  id: string
  name: string
  description: string
  image?: string
  model?: string
  prepTime: number
  cookingTime: number
  difficulty: "easy" | "medium" | "hard"
  servings: number
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  tips?: string[]
  nutrition?: RecipeNutrition
}

type RecipesContextType = {
  recipes: Recipe[]
  addRecipe: (recipe: Recipe) => void
  updateRecipe: (recipe: Recipe) => void
  removeRecipe: (id: string) => void
}

const RecipesContext = createContext<RecipesContextType | undefined>(undefined)

// Sample recipes data
const sampleRecipes: Recipe[] = [
  {
    id: "1",
    name: "Tomato Chicken Rice",
    description: "A delicious one-pot meal with chicken, rice, and fresh tomatoes.",
    prepTime: 15,
    cookingTime: 30,
    difficulty: "medium",
    servings: 4,
    ingredients: [
      { name: "Chicken Breast", quantity: 400, unit: "g" },
      { name: "Rice", quantity: 300, unit: "g" },
      { name: "Tomatoes", quantity: 3, unit: "pcs" },
      { name: "Onions", quantity: 1, unit: "pcs" },
      { name: "Garlic", quantity: 2, unit: "pcs" },
      { name: "Olive Oil", quantity: 30, unit: "ml" },
      { name: "Salt", quantity: 5, unit: "g" },
      { name: "Pepper", quantity: 3, unit: "g" },
    ],
    steps: [
      {
        title: "Prepare ingredients",
        description: "Dice the chicken breast into 1-inch cubes. Chop the tomatoes and onions. Mince the garlic.",
      },
      {
        title: "Cook chicken",
        description:
          "Heat olive oil in a large pan over medium heat. Add chicken and cook until browned on all sides, about 5-7 minutes.",
        timer: 420,
      },
      {
        title: "Add vegetables",
        description: "Add onions and garlic to the pan. Cook for 2-3 minutes until softened.",
        timer: 180,
      },
      {
        title: "Add rice and tomatoes",
        description: "Add rice and tomatoes to the pan. Stir to combine.",
      },
      {
        title: "Add liquid and seasonings",
        description: "Add 600ml of water, salt, and pepper. Bring to a boil, then reduce heat to low.",
      },
      {
        title: "Simmer",
        description: "Cover and simmer for 20 minutes, or until rice is tender and liquid is absorbed.",
        timer: 1200,
      },
      {
        title: "Serve",
        description: "Let stand for 5 minutes, then fluff with a fork and serve hot.",
        timer: 300,
      },
    ],
    tips: [
      "For extra flavor, add a bay leaf or some dried herbs like thyme or oregano.",
      "You can substitute chicken with tofu for a vegetarian version.",
      "Leftovers can be stored in the refrigerator for up to 3 days.",
    ],
    nutrition: {
      calories: 420,
      protein: 28,
      carbs: 45,
      fat: 12,
    },
  },
  {
    id: "2",
    name: "Garlic Olive Oil Pasta",
    description: "A simple and flavorful pasta dish with garlic and olive oil.",
    prepTime: 5,
    cookingTime: 15,
    difficulty: "easy",
    servings: 2,
    ingredients: [
      { name: "Pasta", quantity: 200, unit: "g" },
      { name: "Garlic", quantity: 3, unit: "pcs" },
      { name: "Olive Oil", quantity: 45, unit: "ml" },
      { name: "Salt", quantity: 5, unit: "g" },
      { name: "Pepper", quantity: 2, unit: "g" },
    ],
    steps: [
      {
        title: "Cook pasta",
        description:
          "Bring a large pot of salted water to a boil. Add pasta and cook according to package instructions until al dente.",
        timer: 600,
      },
      {
        title: "Prepare garlic oil",
        description:
          "While pasta is cooking, heat olive oil in a large pan over low heat. Add minced garlic and cook gently until fragrant but not browned, about 2 minutes.",
        timer: 120,
      },
      {
        title: "Combine",
        description:
          "Drain pasta, reserving 1/4 cup of pasta water. Add pasta to the pan with garlic oil. Toss to coat, adding pasta water as needed to create a light sauce.",
      },
      {
        title: "Season",
        description: "Season with salt and pepper to taste. Serve immediately.",
      },
    ],
    tips: [
      "Add red pepper flakes for a spicy kick.",
      "Fresh herbs like parsley or basil make a great garnish.",
      "For a more substantial meal, add grilled chicken or sautéed vegetables.",
    ],
    nutrition: {
      calories: 380,
      protein: 10,
      carbs: 50,
      fat: 15,
    },
  },
  {
    id: "3",
    name: "Tomato and Onion Salad",
    description: "A refreshing salad with ripe tomatoes and onions.",
    prepTime: 10,
    cookingTime: 0,
    difficulty: "easy",
    servings: 2,
    ingredients: [
      { name: "Tomatoes", quantity: 3, unit: "pcs" },
      { name: "Onions", quantity: 1, unit: "pcs" },
      { name: "Olive Oil", quantity: 15, unit: "ml" },
      { name: "Salt", quantity: 2, unit: "g" },
      { name: "Pepper", quantity: 1, unit: "g" },
    ],
    steps: [
      {
        title: "Prepare vegetables",
        description: "Slice tomatoes and thinly slice onions.",
      },
      {
        title: "Combine",
        description: "Arrange tomatoes and onions on a plate or in a bowl.",
      },
      {
        title: "Dress",
        description: "Drizzle with olive oil and season with salt and pepper.",
      },
      {
        title: "Serve",
        description: "Serve immediately or chill for 15-30 minutes for a more refreshing salad.",
        timer: 900,
      },
    ],
    tips: [
      "Add fresh herbs like basil or parsley for extra flavor.",
      "A splash of vinegar or lemon juice adds brightness.",
      "For a more substantial salad, add cucumber, feta cheese, or olives.",
    ],
    nutrition: {
      calories: 120,
      protein: 2,
      carbs: 10,
      fat: 8,
    },
  },
]

export function RecipesProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([])

  // Load recipes from localStorage on mount
  useEffect(() => {
    const savedRecipes = localStorage.getItem("Cheffy_recipes")
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes))
    } else {
      // Use sample data for demo
      setRecipes(sampleRecipes)
    }
  }, [])

  // Save recipes to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("Cheffy_recipes", JSON.stringify(recipes))
  }, [recipes])

  const addRecipe = (recipe: Recipe) => {
    setRecipes((prev) => [...prev, recipe])
  }

  const updateRecipe = (recipe: Recipe) => {
    setRecipes((prev) => prev.map((r) => (r.id === recipe.id ? recipe : r)))
  }

  const removeRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <RecipesContext.Provider value={{ recipes, addRecipe, updateRecipe, removeRecipe }}>
      {children}
    </RecipesContext.Provider>
  )
}

export function useRecipes() {
  const context = useContext(RecipesContext)
  if (context === undefined) {
    throw new Error("useRecipes must be used within a RecipesProvider")
  }
  return context
}
