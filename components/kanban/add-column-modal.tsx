"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddColumnModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddColumn: (title: string, color: string) => void
}

export function AddColumnModal({ open, onOpenChange, onAddColumn }: AddColumnModalProps) {
  const [title, setTitle] = useState("")
  const [color, setColor] = useState("bg-gray-100")

  const colorOptions = [
    { value: "bg-gray-100", label: "Gray", preview: "bg-gray-100" },
    { value: "bg-blue-100", label: "Blue", preview: "bg-blue-100" },
    { value: "bg-green-100", label: "Green", preview: "bg-green-100" },
    { value: "bg-yellow-100", label: "Yellow", preview: "bg-yellow-100" },
    { value: "bg-red-100", label: "Red", preview: "bg-red-100" },
    { value: "bg-purple-100", label: "Purple", preview: "bg-purple-100" },
    { value: "bg-pink-100", label: "Pink", preview: "bg-pink-100" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddColumn(title.trim(), color)
      setTitle("")
      setColor("bg-gray-100")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
          <DialogDescription>Create a new column to organize your tasks.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Column Title</Label>
              <Input
                id="title"
                placeholder="Enter column title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Column Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded ${option.preview} border`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Column</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
