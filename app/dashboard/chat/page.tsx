"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { useInventory } from "@/hooks/use-inventory"
import { useRecipes } from "@/hooks/use-recipes"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const { t } = useTranslation()
  const { inventory } = useInventory()
  const { recipes } = useRecipes()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your kitchen assistant. I can help you find recipes based on your inventory, suggest meal ideas, or answer cooking questions. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Create inventory context for the AI
      const inventoryContext =
        inventory.length > 0
          ? `Current inventory: ${inventory.map((item) => `${item.name} (${item.quantity} ${item.unit})`).join(", ")}.`
          : "Your inventory is currently empty."

      // Create recipes context for the AI
      const recipesContext =
        recipes.length > 0
          ? `Available recipes: ${recipes.map((recipe) => recipe.name).join(", ")}.`
          : "No recipes are currently available."

      // In a real app, we would use a proper AI model
      // For demo purposes, we'll simulate AI responses
      const systemPrompt = `You are a helpful kitchen assistant AI. Your goal is to help users find recipes, suggest meal ideas, and answer cooking questions.
      ${inventoryContext}
      ${recipesContext}
      
      When suggesting recipes, prioritize ones that can be made with the user's current inventory.
      If asked about a specific recipe, provide detailed information about ingredients and preparation steps.
      Be friendly, helpful, and concise in your responses.`

      // Simulate AI response with AI SDK
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: input,
      })

      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: text,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error generating response:", error)

      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">{t("chat.title", "Recipe Assistant")}</h2>
        <p className="text-muted-foreground">
          {t("chat.description", "Ask for recipe suggestions or cooking advice based on your inventory")}
        </p>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start gap-3 max-w-[80%] ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  } rounded-lg p-3`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  <div className="text-sm">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[80%] bg-muted rounded-lg p-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2"
          >
            <Input
              placeholder={t("chat.inputPlaceholder", "Ask about recipes or cooking advice...")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">{t("chat.send", "Send")}</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
