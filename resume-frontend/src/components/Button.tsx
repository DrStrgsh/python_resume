"use client"

import React from "react"
import type { ButtonProps, ButtonVariant } from "./component.types"

const Button = ({ variant = "primary", className = "", asChild = false, children, ...props }: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-semibold uppercase tracking-wider " +
    "transition focus:outline-none disabled:pointer-events-none disabled:opacity-60"

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-space-primary text-black shadow-space-glow hover:bg-space-secondary px-4 py-2 ",
    secondary: "bg-space-secondary text-black shadow-space-glow hover:bg-space-accent px-4 py-2 ",
    ghost:
      "border border-white/15 bg-white/5 text-white" +
      "hover:border-space-secondary/60 hover:text-space-accent px-4 py-2 ",
    link: "text-space-secondary hover:underline focus:ring-2 focus:ring-space-secondary/30 px-1 py-1",
  }

  const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${className}`

  if (asChild) {
    if (!React.isValidElement(children)) {
      return null
    }

    const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>
    const childClassName: string = child.props?.className ?? ""
    const mergedClassName = `${childClassName} ${combinedClassName}`.trim()

    return React.cloneElement(child, {
      className: mergedClassName,
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  )
}

export default Button
