"use client"

import React from "react"

type ButtonVariant = "primary" | "secondary" | "ghost"
type ClassNameProps = { className?: string }

type ButtonAsChildProps = {
  asChild: true
  variant?: ButtonVariant
  className?: string
  children: React.ReactElement<ClassNameProps>
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">

type ButtonNormalProps = {
  asChild?: false
  variant?: ButtonVariant
  className?: string
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export type ButtonProps = ButtonAsChildProps | ButtonNormalProps

const Button = ({
  variant = "primary",
  className = "",
  asChild = false,
  children,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold uppercase tracking-wider transition focus:outline-none disabled:pointer-events-none disabled:opacity-60"

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-space-primary text-black shadow-space-glow hover:bg-space-secondary",
    secondary: "bg-space-secondary text-black shadow-space-glow hover:bg-space-accent",
    ghost: "border border-white/15 bg-white/5 text-white hover:border-space-secondary/60 hover:text-space-accent",
  }

  const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${className}`

  if (asChild) {
    if (!React.isValidElement(children)) {
      return null
    }

    const child = children as React.ReactElement<any>
    const childClassName: string = child.props?.className ?? ""
    const mergedClassName = `${childClassName} ${combinedClassName}`.trim()
    const clone = React.cloneElement as unknown as (
      element: React.ReactElement<any>,
      props: Record<string, unknown>
    ) => React.ReactElement<any>

    return clone(child, { className: mergedClassName })
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  )
}

export default Button
