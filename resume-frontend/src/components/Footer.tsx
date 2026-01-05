import React from "react"

import { TelegramIcon, LinkedinIcon, EmailIcon, GithubIcon } from "./Icons"
import type { IconLinkProps } from "./component.types"

const IconLink = ({ href, label, isExternal = true, children }: IconLinkProps) => {
  const externalProps = isExternal ? { target: "_blank", rel: "noreferrer" } : {}

  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className="
        inline-flex h-10 w-10 items-center justify-center rounded-lg
        border border-white/10 bg-white/5
        text-white/80
        transition
        hover:text-space-accent hover:border-space-secondary/60
        hover:shadow-[0_0_18px_rgba(123,201,255,0.20)]
        hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-space-secondary/30
      "
      {...externalProps}
    >
      {children}
    </a>
  )
}

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-space-bg/40 backdrop-blur">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-4">
        <div className="text-xs text-white/50">© {new Date().getFullYear()} STRGSH</div>
        <div className="flex items-center gap-3">
          <IconLink href="https://t.me/OmenStr" label="Telegram">
            <TelegramIcon />
          </IconLink>
          <IconLink href="https://github.com/DrStrgsh" label="GitHub">
            <GithubIcon />
          </IconLink>
          <IconLink href="mailto:dr.strgsh@gmail.com" label="Email: dr.strgsh@gmail.com" isExternal={false}>
            <EmailIcon />
          </IconLink>
          <IconLink href="https://linkedin.com/in/oleh-strohush-ab9b6519b" label="LinkedIn">
            <LinkedinIcon />
          </IconLink>
        </div>
      </div>
    </footer>
  )
}

export default Footer
