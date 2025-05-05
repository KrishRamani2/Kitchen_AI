"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define translations
const translations = {
  en: {
    // Common
    "theme.toggleLight": "Switch to light mode",
    "theme.toggleDark": "Switch to dark mode",

    // Signup
    "signup.title": "Create an Account",
    "signup.description": "Sign up to start managing your kitchen and discovering recipes",
    "signup.name": "Name",
    "signup.namePlaceholder": "Enter your name",
    "signup.email": "Email",
    "signup.emailPlaceholder": "Enter your email",
    "signup.password": "Password",
    "signup.passwordPlaceholder": "Create a password",
    "signup.hidePassword": "Hide password",
    "signup.showPassword": "Show password",
    "signup.createAccount": "Create Account",
    "signup.alreadyHaveAccount": "Already have an account?",
    "signup.login": "Login",

    // Login
    "login.title": "Login to Your Account",
    "login.description": "Welcome back! Enter your credentials to continue",
    "login.email": "Email",
    "login.emailPlaceholder": "Enter your email",
    "login.password": "Password",
    "login.passwordPlaceholder": "Enter your password",
    "login.hidePassword": "Hide password",
    "login.showPassword": "Show password",
    "login.rememberMe": "Remember me",
    "login.forgotPassword": "Forgot password?",
    "login.signIn": "Sign In",
    "login.dontHaveAccount": "Don't have an account?",
    "login.signup": "Sign up",

    // Dashboard
    "dashboard.inventory": "Inventory",
    "dashboard.recipes": "Recipes",
    "dashboard.chat": "Recipe Assistant",
    "dashboard.profile": "Profile",
    "dashboard.logout": "Logout",

    // Inventory
    "inventory.title": "Inventory Management",
    "inventory.description": "Manage your kitchen ingredients and supplies",
    "inventory.addItem": "Add Item",
    "inventory.addNewItem": "Add New Item",
    "inventory.addItemDescription": "Add a new item to your inventory",
    "inventory.name": "Name",
    "inventory.quantity": "Quantity",
    "inventory.unit": "Unit",
    "inventory.category": "Category",
    "inventory.expiryDate": "Expiry Date",
    "inventory.selectUnit": "Select unit",
    "inventory.selectCategory": "Select category",
    "inventory.add": "Add",
    "inventory.search": "Search items...",
    "inventory.editItem": "Edit Item",
    "inventory.editItemDescription": "Update the details of your inventory item",
    "inventory.save": "Save Changes",
    "inventory.expires": "Expires",
    "inventory.noItems": "No items found",
    "inventory.noItemsSearch": "No items match your search",
    "inventory.emptyInventory": "Your inventory is empty. Add some items to get started.",

    // Units
    "inventory.units.pcs": "Pieces",
    "inventory.units.g": "Grams",
    "inventory.units.kg": "Kilograms",
    "inventory.units.ml": "Milliliters",
    "inventory.units.l": "Liters",
    "inventory.units.tbsp": "Tablespoons",
    "inventory.units.tsp": "Teaspoons",

    // Categories
    "inventory.categories.produce": "Produce",
    "inventory.categories.dairy": "Dairy",
    "inventory.categories.meat": "Meat",
    "inventory.categories.grains": "Grains",
    "inventory.categories.spices": "Spices",
    "inventory.categories.other": "Other",

    // Recipes
    "recipes.title": "Recipes",
    "recipes.description": "Discover recipes based on your inventory",
    "recipes.search": "Search recipes...",
    "recipes.filter": "Filter",
    "recipes.filters.all": "All Recipes",
    "recipes.filters.makeable": "Can Make Now",
    "recipes.filters.partial": "Have Some Ingredients",
    "recipes.sortBy": "Sort by",
    "recipes.sort.name": "Name",
    "recipes.sort.time": "Cooking Time",
    "recipes.sort.difficulty": "Difficulty",
    "recipes.canMake": "Can Make",
    "recipes.partial": "Partial",
    "recipes.minutes": "min",
    "recipes.difficulty.easy": "Easy",
    "recipes.difficulty.medium": "Medium",
    "recipes.difficulty.hard": "Hard",
    "recipes.viewRecipe": "View Recipe",
    "recipes.noRecipes": "No recipes found",
    "recipes.noRecipesFiltered": "No recipes match your search or filter criteria",
    "recipes.emptyRecipes": "No recipes available. Try adding some ingredients to your inventory first.",

    // Recipe Detail
    "recipe.steps": "Steps",
    "recipe.ingredients": "Ingredients",
    "recipe.nutrition": "Nutrition",
    "recipe.step": "Step",
    "recipe.minutes": "min",
    "recipe.previous": "Previous",
    "recipe.next": "Next",
    "recipe.timer": "Timer",
    "recipe.startTimer": "Start",
    "recipe.pauseTimer": "Pause",
    "recipe.resetTimer": "Reset",
    "recipe.requiredIngredients": "Required Ingredients",
    "recipe.useIngredients": "Use Ingredients",
    "recipe.nutritionInfo": "Nutrition Information",
    "recipe.calories": "Calories",
    "recipe.protein": "Protein",
    "recipe.carbs": "Carbohydrates",
    "recipe.fat": "Fat",
    "recipe.noNutrition": "Nutrition information not available for this recipe.",
    "recipe.details": "Recipe Details",
    "recipe.prepTime": "Prep Time",
    "recipe.cookTime": "Cook Time",
    "recipe.difficulty": "Difficulty",
    "recipe.difficultyLevel.easy": "Easy",
    "recipe.difficultyLevel.medium": "Medium",
    "recipe.difficultyLevel.hard": "Hard",
    "recipe.servings": "Servings",
    "recipe.tips": "Chef's Tips",
    "recipe.noTips": "No tips available for this recipe.",

    // Chat
    "chat.title": "Recipe Assistant",
    "chat.description": "Ask for recipe suggestions or cooking advice based on your inventory",
    "chat.inputPlaceholder": "Ask about recipes or cooking advice...",
    "chat.send": "Send",
  },
  es: {
    // Common
    "theme.toggleLight": "Cambiar a modo claro",
    "theme.toggleDark": "Cambiar a modo oscuro",

    // Signup
    "signup.title": "Crear una Cuenta",
    "signup.description": "Regístrate para comenzar a administrar tu cocina y descubrir recetas",
    "signup.name": "Nombre",
    "signup.namePlaceholder": "Ingresa tu nombre",
    "signup.email": "Correo electrónico",
    "signup.emailPlaceholder": "Ingresa tu correo electrónico",
    "signup.password": "Contraseña",
    "signup.passwordPlaceholder": "Crea una contraseña",
    "signup.hidePassword": "Ocultar contraseña",
    "signup.showPassword": "Mostrar contraseña",
    "signup.createAccount": "Crear Cuenta",
    "signup.alreadyHaveAccount": "¿Ya tienes una cuenta?",
    "signup.login": "Iniciar sesión",

    // More Spanish translations...
  },
  // Add more languages as needed
}

// Create context
type LanguageContextType = {
  language: string
  setLanguage: (language: string) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Create provider
type LanguageProviderProps = {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState("en")

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("Cheffy_language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("Cheffy_language", language)
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

// Create hook for using language
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Create hook for translations
export function useTranslation() {
  const { language } = useLanguage()

  const t = (key: string, fallback = "") => {
    if (!translations[language] || !translations[language][key]) {
      // Fallback to English or provided fallback
      return translations["en"]?.[key] || fallback || key
    }
    return translations[language][key]
  }

  return { t }
}
