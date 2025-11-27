'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Presentation } from "./PresentationList";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface CreatePresentationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPresentation: Presentation | null;
  setSelectedPresentation: (presentation: Presentation | null) => void;
  onSave: (presentation: Presentation) => void;
}

export default function CreatePresentationModal({
  open,
  onOpenChange,
  selectedPresentation,
  setSelectedPresentation,
  onSave
}: CreatePresentationModalProps) {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPresentation) return
    onSave(selectedPresentation)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear presentación</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Nombre de la presentación"
              value={selectedPresentation?.name || ""}
              onChange={(e) => setSelectedPresentation({ ...selectedPresentation, name: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="isActive">¿Activar?</Label>
            <Checkbox
              id="isActive"
              checked={selectedPresentation?.isActive || false}
              onCheckedChange={(checked) => setSelectedPresentation({ ...(selectedPresentation || { name: "" }), isActive: checked === true })}
            />
          </div>
          <Button type="submit" disabled={!selectedPresentation?.name}>Guardar</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}