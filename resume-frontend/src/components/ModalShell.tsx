"use client"

import React, { useEffect } from "react"

import Button from "./Button"
import type { ModalShellProps } from "./component.types"

const ModalShell = ({ isOpen, title, onClose, children }: ModalShellProps) => {
  useEffect(() => {
    if (!isOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", onKeyDown)

    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="
          w-full max-w-2xl rounded-2xl border border-white/10 bg-space-bg/90 p-5 shadow-space-form-glow backdrop-blur
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-sm uppercase tracking-widest text-white">{title}</h2>

          <Button type="button" onClick={onClose} variant="ghost">
            Close
          </Button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

export default ModalShell
