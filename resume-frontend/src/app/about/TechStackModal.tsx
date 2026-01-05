"use client"

import React from "react"
import { useState } from "react"

import type { TechInput, TechModalProps } from "./about.types"
import ModalShell from "@/components/ModalShell"
import Button from "@/components/Button"
import { useTechMutations } from "@/features/technologies/useTechnologies"

export default function TechStackModal({ isOpen, mode, initialTech = null, onClose }: TechModalProps) {
  function emptyForm(): TechInput {
    return {
      name: "",
      start_year: new Date().getFullYear(),
    }
  }
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { createTech, updateTech, isCreating, isUpdating } = useTechMutations({ onClose, setErrorMessage })
  const [form, setForm] = useState<TechInput>(() => {
    if (mode === "edit" && initialTech) {
      return {
        name: initialTech.name,
        start_year: initialTech.start_year,
      }
    }
    return emptyForm()
  })

  function title() {
    return mode === "create" ? "Create Tech" : "Edit Tech"
  }

  const isSaving = isCreating || isUpdating

  function setField<K extends keyof TechInput>(key: K, value: TechInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!form.name.trim() || !form.start_year) {
      setErrorMessage("Name and start year are required")
      return
    }

    const payload: TechInput = {
      name: form.name.trim(),
      start_year: form.start_year,
    }

    if (mode === "create") {
      createTech(payload)
      return
    }

    if (!initialTech) {
      setErrorMessage("No tech to update")
      return
    }

    updateTech({ id: initialTech.id, input: payload })
  }

  return (
    <ModalShell isOpen={isOpen} title={title()} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-white/60">Name *</label>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className="
                mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none
                focus:border-space-secondary/60
              "
              placeholder="React"
            />
          </div>
          <div>
            <label className="text-xs text-white/60">Start Year *</label>
            <input
              value={form.start_year}
              onChange={(e) => setField("start_year", parseInt(e.target.value))}
              className="
                mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none
                focus:border-space-secondary/60
              "
              placeholder="2018"
            />
          </div>
        </div>
        {errorMessage && <p className="text-sm text-space-accent">{errorMessage}</p>}
        <div className="flex justify-between items-center gap-3 pt-6">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}
