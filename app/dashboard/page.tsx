"use client"

import { useState } from "react"
import { Plus, Trash2, Edit, Search, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/hooks/use-translation"
import { useInventory } from "@/hooks/use-inventory"

type InventoryItem = {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  expiryDate?: string
}

export default function InventoryPage() {
  const { t } = useTranslation()
  const { inventory, addItem, updateItem, removeItem } = useInventory()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null)
  const [newItem, setNewItem] = useState<Omit<InventoryItem, "id">>({
    name: "",
    quantity: 1,
    unit: "pcs",
    category: "produce",
    expiryDate: "",
  })

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddItem = () => {
    addItem({
      ...newItem,
      id: Date.now().toString(),
    })
    setNewItem({
      name: "",
      quantity: 1,
      unit: "pcs",
      category: "produce",
      expiryDate: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditItem = () => {
    if (currentItem) {
      updateItem(currentItem)
      setCurrentItem(null)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteItem = (id: string) => {
    removeItem(id)
  }

  const openEditDialog = (item: InventoryItem) => {
    setCurrentItem(item)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("inventory.title", "Inventory Management")}</h2>
          <p className="text-muted-foreground">
            {t("inventory.description", "Manage your kitchen ingredients and supplies")}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("inventory.addItem", "Add Item")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("inventory.addNewItem", "Add New Item")}</DialogTitle>
              <DialogDescription>
                {t("inventory.addItemDescription", "Add a new item to your inventory")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  {t("inventory.name", "Name")}
                </Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  {t("inventory.quantity", "Quantity")}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  {t("inventory.unit", "Unit")}
                </Label>
                <Select value={newItem.unit} onValueChange={(value) => setNewItem({ ...newItem, unit: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t("inventory.selectUnit", "Select unit")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">{t("inventory.units.pcs", "Pieces")}</SelectItem>
                    <SelectItem value="g">{t("inventory.units.g", "Grams")}</SelectItem>
                    <SelectItem value="kg">{t("inventory.units.kg", "Kilograms")}</SelectItem>
                    <SelectItem value="ml">{t("inventory.units.ml", "Milliliters")}</SelectItem>
                    <SelectItem value="l">{t("inventory.units.l", "Liters")}</SelectItem>
                    <SelectItem value="tbsp">{t("inventory.units.tbsp", "Tablespoons")}</SelectItem>
                    <SelectItem value="tsp">{t("inventory.units.tsp", "Teaspoons")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  {t("inventory.category", "Category")}
                </Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t("inventory.selectCategory", "Select category")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="produce">{t("inventory.categories.produce", "Produce")}</SelectItem>
                    <SelectItem value="dairy">{t("inventory.categories.dairy", "Dairy")}</SelectItem>
                    <SelectItem value="meat">{t("inventory.categories.meat", "Meat")}</SelectItem>
                    <SelectItem value="grains">{t("inventory.categories.grains", "Grains")}</SelectItem>
                    <SelectItem value="spices">{t("inventory.categories.spices", "Spices")}</SelectItem>
                    <SelectItem value="other">{t("inventory.categories.other", "Other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiryDate" className="text-right">
                  {t("inventory.expiryDate", "Expiry Date")}
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddItem}>
                {t("inventory.add", "Add")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={t("inventory.search", "Search items...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInventory.length > 0 ? (
          filteredInventory.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{t(`inventory.categories.${item.category}`, item.category)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <span>
                    {item.quantity} {t(`inventory.units.${item.unit}`, item.unit)}
                  </span>
                  {item.expiryDate && (
                    <span className="text-sm text-muted-foreground">
                      {t("inventory.expires", "Expires")}: {new Date(item.expiryDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="icon" onClick={() => openEditDialog(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDeleteItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-muted p-3">
              <ShoppingCart className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{t("inventory.noItems", "No items found")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm
                ? t("inventory.noItemsSearch", "No items match your search")
                : t("inventory.emptyInventory", "Your inventory is empty. Add some items to get started.")}
            </p>
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("inventory.editItem", "Edit Item")}</DialogTitle>
            <DialogDescription>
              {t("inventory.editItemDescription", "Update the details of your inventory item")}
            </DialogDescription>
          </DialogHeader>
          {currentItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  {t("inventory.name", "Name")}
                </Label>
                <Input
                  id="edit-name"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-quantity" className="text-right">
                  {t("inventory.quantity", "Quantity")}
                </Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  min="0"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-unit" className="text-right">
                  {t("inventory.unit", "Unit")}
                </Label>
                <Select
                  value={currentItem.unit}
                  onValueChange={(value) => setCurrentItem({ ...currentItem, unit: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t("inventory.selectUnit", "Select unit")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">{t("inventory.units.pcs", "Pieces")}</SelectItem>
                    <SelectItem value="g">{t("inventory.units.g", "Grams")}</SelectItem>
                    <SelectItem value="kg">{t("inventory.units.kg", "Kilograms")}</SelectItem>
                    <SelectItem value="ml">{t("inventory.units.ml", "Milliliters")}</SelectItem>
                    <SelectItem value="l">{t("inventory.units.l", "Liters")}</SelectItem>
                    <SelectItem value="tbsp">{t("inventory.units.tbsp", "Tablespoons")}</SelectItem>
                    <SelectItem value="tsp">{t("inventory.units.tsp", "Teaspoons")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  {t("inventory.category", "Category")}
                </Label>
                <Select
                  value={currentItem.category}
                  onValueChange={(value) => setCurrentItem({ ...currentItem, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t("inventory.selectCategory", "Select category")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="produce">{t("inventory.categories.produce", "Produce")}</SelectItem>
                    <SelectItem value="dairy">{t("inventory.categories.dairy", "Dairy")}</SelectItem>
                    <SelectItem value="meat">{t("inventory.categories.meat", "Meat")}</SelectItem>
                    <SelectItem value="grains">{t("inventory.categories.grains", "Grains")}</SelectItem>
                    <SelectItem value="spices">{t("inventory.categories.spices", "Spices")}</SelectItem>
                    <SelectItem value="other">{t("inventory.categories.other", "Other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-expiryDate" className="text-right">
                  {t("inventory.expiryDate", "Expiry Date")}
                </Label>
                <Input
                  id="edit-expiryDate"
                  type="date"
                  value={currentItem.expiryDate || ""}
                  onChange={(e) => setCurrentItem({ ...currentItem, expiryDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEditItem}>
              {t("inventory.save", "Save Changes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
