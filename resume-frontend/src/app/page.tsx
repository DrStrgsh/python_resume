import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6 text-center">
      <div className="relative mb-8 group">
        <Image src="/logo/strgsh-wide.png" alt="STRGSH" width={600} height={6000} className="object-cover" priority />
      </div>
      <h1 className="text-5xl md:text-7xl font-display uppercase tracking-[0.2em] text-white animate-pulse">
        Oleh Strohush
      </h1>
      <p className="mt-4 text-space-secondary font-mono tracking-widest uppercase">
        Software Engineer // Full-Stack Web Developer // Creator
      </p>
      <div className="mt-12 flex gap-4">
        <Link
          href="/projects"
          className="
            border border-white/20 px-8 py-3 hover:bg-white w-47 justify-center
            hover:text-black transition-all font-mono uppercase text-sm
          "
        >
          View Projects
        </Link>
        <Link
          href="/about"
          className="
            border border-space-secondary/50 text-space-secondary px-8 py-3 hover:bg-space-secondary
            hover:text-black transition-all font-mono uppercase text-sm w-47 justify-center
          "
        >
          About Me
        </Link>
      </div>
      <section className="mt-24 max-w-2xl text-white/60 leading-relaxed font-light">
        <p>Exploring the digital void and building meaningful experiences using Next.js and Python.</p>
      </section>
    </main>
  )
}
