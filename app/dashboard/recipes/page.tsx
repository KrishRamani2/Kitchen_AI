"use client"

import { useState } from "react"
import { Search, Filter, ChevronRight, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/hooks/use-translation"
import { useInventory } from "@/hooks/use-inventory"
import { useRecipes } from "@/hooks/use-recipes"
import Link from "next/link"

export default function RecipesPage() {
  const { t } = useTranslation()
  const { inventory } = useInventory()
  const { recipes } = useRecipes()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // Filter recipes based on search term and filter type
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterType === "all") return matchesSearch
    if (filterType === "makeable") {
      // Check if all required ingredients are in inventory
      const canMake = recipe.ingredients.every((recipeIngredient) => {
        const inventoryItem = inventory.find((item) => item.name.toLowerCase() === recipeIngredient.name.toLowerCase())
        return inventoryItem && inventoryItem.quantity >= recipeIngredient.quantity
      })
      return matchesSearch && canMake
    }
    if (filterType === "partial") {
      // Check if at least one required ingredient is in inventory
      const hasPartial = recipe.ingredients.some((recipeIngredient) => {
        const inventoryItem = inventory.find((item) => item.name.toLowerCase() === recipeIngredient.name.toLowerCase())
        return inventoryItem && inventoryItem.quantity > 0
      })
      return matchesSearch && hasPartial
    }
    return matchesSearch
  })

  // Sort recipes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    }
    if (sortBy === "time") {
      return a.cookingTime - b.cookingTime
    }
    if (sortBy === "difficulty") {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
    }
    return 0
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("recipes.title", "Recipes")}</h2>
        <p className="text-muted-foreground">{t("recipes.description", "Discover recipes based on your inventory")}</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("recipes.search", "Search recipes...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t("recipes.filter", "Filter")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("recipes.filters.all", "All Recipes")}</SelectItem>
                <SelectItem value="makeable">{t("recipes.filters.makeable", "Can Make Now")}</SelectItem>
                <SelectItem value="partial">{t("recipes.filters.partial", "Have Some Ingredients")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t("recipes.sortBy", "Sort by")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t("recipes.sort.name", "Name")}</SelectItem>
                <SelectItem value="time">{t("recipes.sort.time", "Cooking Time")}</SelectItem>
                <SelectItem value="difficulty">{t("recipes.sort.difficulty", "Difficulty")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedRecipes.length > 0 ? (
          sortedRecipes.map((recipe) => {
            // Check if recipe is makeable with current inventory
            const canMake = recipe.ingredients.every((recipeIngredient) => {
              const inventoryItem = inventory.find(
                (item) => item.name.toLowerCase() === recipeIngredient.name.toLowerCase(),
              )
              return inventoryItem && inventoryItem.quantity >= recipeIngredient.quantity
            })

            // Check if at least one ingredient is available
            const hasPartial = recipe.ingredients.some((recipeIngredient) => {
              const inventoryItem = inventory.find(
                (item) => item.name.toLowerCase() === recipeIngredient.name.toLowerCase(),
              )
              return inventoryItem && inventoryItem.quantity > 0
            })

            return (
              <Card key={recipe.id} className="overflow-hidden">
                <div className="aspect-video w-full bg-muted relative">
                  <img
                    src={recipe.image || `/placeholder.svg?height=200&width=400`}
                    alt={recipe.name}
                    className="object-cover w-full h-full"
                  />
                  {canMake && (
                    <Badge className="absolute top-2 right-2 bg-green-500">{t("recipes.canMake", "Can Make")}</Badge>
                  )}
                  {!canMake && hasPartial && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500">{t("recipes.partial", "Partial")}</Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{recipe.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center text-sm">
                      <span className="font-medium">{recipe.cookingTime}</span>
                      <span className="ml-1 text-muted-foreground">{t("recipes.minutes", "min")}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="capitalize font-medium">
                        {t(`recipes.difficulty.${recipe.difficulty}`, recipe.difficulty)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/dashboard/recipes/${recipe.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      {t("recipes.viewRecipe", "View Recipe")}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-muted p-3">
              <Utensils className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{t("recipes.noRecipes", "No recipes found")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm || filterType !== "all"
                ? t("recipes.noRecipesFiltered", "No recipes match your search or filter criteria")
                : t(
                    "recipes.emptyRecipes",
                    "No recipes available. Try adding some ingredients to your inventory first.",
                  )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
