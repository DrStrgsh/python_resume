import Link from "next/link"

type IconLinkProps = {
  href: string
  label: string
  isExternal?: boolean
  children: React.ReactNode
}

const IconLink = ({ href, label, isExternal = true, children }: IconLinkProps) => {
  const externalProps = isExternal ? { target: "_blank", rel: "noreferrer" }: {}

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
        <div className="text-xs text-white/50">
          © {new Date().getFullYear()} STRGSH
        </div>
        <div className="flex items-center gap-3">
          <IconLink href="https://t.me/OmenStr" label="Telegram OmenStr">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M9.04 15.54 8.87 19.2c.58 0 .83-.25 1.13-.55l2.72-2.59 5.64 4.12c1.03.57 1.76.27 2.02-.95l3.66-17.2c.35-1.62-.58-2.26-1.59-1.88L1.57 9.6c-1.57.61-1.55 1.49-.27 1.88l5.94 1.85L20.8 4.8c.64-.39 1.23-.17.75.22" />
            </svg>
          </IconLink>
          <IconLink href="https://github.com/DrStrgsh" label="GitHub DrStrgsh">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.73.5.75 5.62.75 12c0 5.13 3.29 9.48 7.86 11.02.58.11.8-.26.8-.57v-2.2c-3.2.71-3.88-1.4-3.88-1.4-.52-1.36-1.28-1.72-1.28-1.72-1.05-.73.08-.72.08-.72 1.16.08 1.77 1.23 1.77 1.23 1.03 1.81 2.7 1.29 3.36.99.1-.77.4-1.29.73-1.59-2.55-.3-5.23-1.31-5.23-5.83 0-1.29.44-2.34 1.16-3.17-.12-.3-.5-1.5.11-3.13 0 0 .96-.31 3.14 1.21a10.6 10.6 0 0 1 2.86-.4c.97 0 1.95.14 2.86.4 2.18-1.52 3.14-1.21 3.14-1.21.61 1.63.23 2.83.11 3.13.72.83 1.16 1.88 1.16 3.17 0 4.53-2.69 5.53-5.25 5.83.41.37.78 1.1.78 2.22v3.29c0 .31.21.69.81.57 4.57-1.54 7.86-5.89 7.86-11.02C23.25 5.62 18.27.5 12 .5Z" />
            </svg>
          </IconLink>
          <IconLink href="mailto:dr.strgsh@gmail.com" label="Email: dr.strgsh@gmail.com" isExternal={false}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z" />
            </svg>
          </IconLink>
          <IconLink href="#" label="LinkedIn (placeholder)" isExternal={false}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5C3.6 3.5 2.5 4.62 2.5 6s1.1 2.5 2.48 2.5H5A2.5 2.5 0 0 0 7.5 6 2.5 2.5 0 0 0 5 3.5h-.02ZM3 21h4V9H3v12Zm7-12h3.8v1.64h.06c.53-1 1.83-2.06 3.77-2.06C21 8.58 22 10.36 22 13.02V21h-4v-6.5c0-1.55-.03-3.55-2.17-3.55-2.17 0-2.5 1.7-2.5 3.45V21h-4V9Z" />
            </svg>
          </IconLink>
        </div>
      </div>
    </footer>
  )
}

export default Footer
