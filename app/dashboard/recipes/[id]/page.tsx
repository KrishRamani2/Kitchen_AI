"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, ChefHat, Check, Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/hooks/use-translation"
import { useRecipes } from "@/hooks/use-recipes"
import { useInventory } from "@/hooks/use-inventory"
import RecipeModel from "@/components/recipe-model"

export default function RecipeDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const { recipes } = useRecipes()
  const { inventory, updateItem } = useInventory()
  const [recipe, setRecipe] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerInterval, setTimerInterval] = useState(null)
  const [show3D, setShow3D] = useState(true)

  useEffect(() => {
    if (params.id) {
      const foundRecipe = recipes.find((r) => r.id === params.id)
      if (foundRecipe) {
        setRecipe(foundRecipe)
      } else {
        router.push("/dashboard/recipes")
      }
    }
  }, [params.id, recipes, router])

  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
      setTimerInterval(interval)
      return () => clearInterval(interval)
    } else if (timerInterval) {
      clearInterval(timerInterval)
    }
  }, [isTimerRunning])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startTimer = () => {
    setIsTimerRunning(true)
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimer(0)
  }

  const nextStep = () => {
    if (recipe && activeStep < recipe.steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const useIngredients = () => {
    if (!recipe) return

    // Update inventory by subtracting used ingredients
    recipe.ingredients.forEach((recipeIngredient) => {
      const inventoryItem = inventory.find((item) => item.name.toLowerCase() === recipeIngredient.name.toLowerCase())

      if (inventoryItem && inventoryItem.quantity >= recipeIngredient.quantity) {
        updateItem({
          ...inventoryItem,
          quantity: inventoryItem.quantity - recipeIngredient.quantity,
        })
      }
    })
  }

  if (!recipe) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Check if recipe is makeable with current inventory
  const canMake = recipe.ingredients.every((recipeIngredient) => {
    const inventoryItem = inventory.find((item) => item.name.toLowerCase() === recipeIngredient.name.toLowerCase())
    return inventoryItem && inventoryItem.quantity >= recipeIngredient.quantity
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/recipes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{recipe.name}</h2>
          <p className="text-muted-foreground">{recipe.description}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden relative">
            {show3D ? (
              <div className="w-full h-full">
                <RecipeModel model={recipe.name.toLowerCase()} />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute bottom-4 right-4 z-10"
                  onClick={() => setShow3D(false)}
                >
                  Show Image
                </Button>
              </div>
            ) : (
              <div className="w-full h-full relative">
                <img
                  src={recipe.image || `/placeholder.svg?height=400&width=800`}
                  alt={recipe.name}
                  className="object-cover w-full h-full"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute bottom-4 right-4"
                  onClick={() => setShow3D(true)}
                >
                  Show 3D
                </Button>
              </div>
            )}
          </div>

          <Tabs defaultValue="steps">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="steps">{t("recipe.steps", "Steps")}</TabsTrigger>
              <TabsTrigger value="ingredients">{t("recipe.ingredients", "Ingredients")}</TabsTrigger>
              <TabsTrigger value="nutrition">{t("recipe.nutrition", "Nutrition")}</TabsTrigger>
            </TabsList>

            <TabsContent value="steps" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {t("recipe.step", "Step")} {activeStep + 1} / {recipe.steps.length}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {recipe.cookingTime} {t("recipe.minutes", "min")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={prevStep} disabled={activeStep === 0}>
                    {t("recipe.previous", "Previous")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextStep}
                    disabled={activeStep === recipe.steps.length - 1}
                  >
                    {t("recipe.next", "Next")}
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{recipe.steps[activeStep].title}</h3>
                  <p>{recipe.steps[activeStep].description}</p>

                  {recipe.steps[activeStep].timer && (
                    <div className="mt-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          <span className="font-semibold">{t("recipe.timer", "Timer")}</span>
                        </div>
                        <div className="text-2xl font-mono">{formatTime(timer)}</div>
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-4">
                        {!isTimerRunning ? (
                          <Button onClick={startTimer}>
                            <Play className="mr-2 h-4 w-4" />
                            {t("recipe.startTimer", "Start")}
                          </Button>
                        ) : (
                          <Button variant="outline" onClick={pauseTimer}>
                            <Pause className="mr-2 h-4 w-4" />
                            {t("recipe.pauseTimer", "Pause")}
                          </Button>
                        )}
                        <Button variant="outline" onClick={resetTimer}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          {t("recipe.resetTimer", "Reset")}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ingredients" className="pt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {t("recipe.requiredIngredients", "Required Ingredients")}
                  </h3>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => {
                      const inventoryItem = inventory.find(
                        (item) => item.name.toLowerCase() === ingredient.name.toLowerCase(),
                      )
                      const hasEnough = inventoryItem && inventoryItem.quantity >= ingredient.quantity

                      return (
                        <li key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {hasEnough ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border border-red-500" />
                            )}
                            <span>{ingredient.name}</span>
                          </div>
                          <span>
                            {ingredient.quantity} {ingredient.unit}
                            {!hasEnough && inventoryItem && (
                              <span className="text-red-500 ml-2">
                                (have {inventoryItem.quantity} {inventoryItem.unit})
                              </span>
                            )}
                            {!hasEnough && !inventoryItem && <span className="text-red-500 ml-2">(missing)</span>}
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                  {canMake && (
                    <Button className="mt-6 w-full" onClick={useIngredients}>
                      <ChefHat className="mr-2 h-4 w-4" />
                      {t("recipe.useIngredients", "Use Ingredients")}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="pt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{t("recipe.nutritionInfo", "Nutrition Information")}</h3>
                  {recipe.nutrition ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">{t("recipe.calories", "Calories")}</span>
                        <span className="font-medium">{recipe.nutrition.calories} kcal</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">{t("recipe.protein", "Protein")}</span>
                        <span className="font-medium">{recipe.nutrition.protein}g</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">{t("recipe.carbs", "Carbohydrates")}</span>
                        <span className="font-medium">{recipe.nutrition.carbs}g</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">{t("recipe.fat", "Fat")}</span>
                        <span className="font-medium">{recipe.nutrition.fat}g</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      {t("recipe.noNutrition", "Nutrition information not available for this recipe.")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{t("recipe.details", "Recipe Details")}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("recipe.prepTime", "Prep Time")}</span>
                  <span>
                    {recipe.prepTime} {t("recipe.minutes", "min")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("recipe.cookTime", "Cook Time")}</span>
                  <span>
                    {recipe.cookingTime} {t("recipe.minutes", "min")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("recipe.difficulty", "Difficulty")}</span>
                  <span className="capitalize">
                    {t(`recipe.difficultyLevel.${recipe.difficulty}`, recipe.difficulty)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("recipe.servings", "Servings")}</span>
                  <span>{recipe.servings}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{t("recipe.tips", "Chef's Tips")}</h3>
              {recipe.tips ? (
                <ul className="space-y-2 list-disc pl-5">
                  {recipe.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">{t("recipe.noTips", "No tips available for this recipe.")}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
