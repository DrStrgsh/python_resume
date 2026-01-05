import React from "react"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link"

export type ButtonAsChildProps = {
  asChild: true
  variant?: ButtonVariant
  className?: string
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">

export type ButtonNormalProps = {
  asChild?: false
  variant?: ButtonVariant
  className?: string
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export type ButtonProps = ButtonAsChildProps | ButtonNormalProps

export type IconLinkProps = {
  href: string
  label: string
  isExternal?: boolean
  children: React.ReactNode
}

export type ModalShellProps = {
  isOpen: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}
