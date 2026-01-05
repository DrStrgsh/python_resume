"use client"

import Image from "next/image"
import { useState } from "react"

import type { Tech, TechModalMode } from "./about.types"
import TechStack from "@/app/about/TechStack"
import { useAuth } from "@/features/auth/useAuth"
import TechStackModal from "@/app/about/TechStackModal"
import Button from "@/components/Button"
import { useTech } from "@/features/technologies/useTechnologies"

export default function AboutPage() {
  const { isAdmin } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<TechModalMode>("create")
  const [editingTech, setEditingTech] = useState<Tech | null>(null)
  const birthDate = "05.04.1998"
  const age = calculateAge(birthDate)
  const experienceYears = new Date().getFullYear() - 2018
  const { data: technologies, isLoading, isError, error } = useTech()

  function calculateAge(birthDateString: string): number {
    const [day, month, year] = birthDateString.split(".").map(Number)
    const today = new Date()
    const birthDate = new Date(year, month - 1, day)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  function openCreate() {
    setModalMode("create")
    setEditingTech(null)
    setIsModalOpen(true)
  }

  function openEdit(tech: Tech) {
    setModalMode("edit")
    setEditingTech(tech)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingTech(null)
  }

  return (
    <>
      <main className="mx-auto w-full max-w-6xl p-6 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4 flex flex-col items-center md:items-start space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-space-secondary/20 rounded-2xl blur-xl animate-pulse" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur">
                <Image
                  src="/me.png"
                  alt="Profile"
                  width={300}
                  height={300}
                  className="rounded-xl object-cover"
                  priority
                />
              </div>
            </div>
            <div className="w-full space-y-4 font-mono uppercase tracking-wider text-sm">
              <div className="border-b border-white/5 pb-2">
                <p className="text-white/40 text-[10px]">Name</p>
                <p className="text-white text-lg font-display">Oleh Strohush</p>
              </div>
              <div className="border-b border-white/5 pb-2">
                <p className="text-white/40 text-[10px]">Birthdate</p>
                <p className="text-white">
                  {birthDate} <span className="text-space-secondary">({age} y.o.)</span>
                </p>
              </div>
              <div className="border-b border-white/5 pb-2">
                <p className="text-white/40 text-[10px]">Nationality</p>
                <p className="text-white">Ukrainian</p>
              </div>
              <div className="border-b border-white/5 pb-2">
                <p className="text-white/40 text-[10px]">Location</p>
                <p className="text-white">Truskavets / Remote</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-8 space-y-8">
            <section>
              <h1
                className="
                  text-4xl font-display uppercase tracking-[0.2em] text-white mb-8 border-b border-space-secondary/30 pb-4
                "
              >
                Profile
              </h1>
              <div className="space-y-6 text-white/70 leading-relaxed text-lg font-light text-justify">
                <p>
                  Born in the small town of <span className="text-white">Truskavets</span>, Lviv region, Ukraine. I
                  graduated from Secondary School No. 1 in Truskavets and later earned both my Bachelor’s and Master’s
                  degrees in <span className="text-space-secondary font-medium">Computer Engineering</span> from the
                  Kyiv National University of Technologies and Design.
                </p>
                <p>
                  I have been working in software development for{" "}
                  <span className="text-white font-mono">{experienceYears} years</span> as a{" "}
                  <span className="text-white">Full Stack Web Developer</span>. My core expertise lies in Ruby on Rails,
                  React JS, and React Native (Expo).
                </p>
                <div className="bg-white/5 border-l-2 border-space-secondary p-6 rounded-r-xl">
                  <p className="italic">
                    Driven by a desire to explore new horizons, I have recently started learning and practicing
                    <span className="text-space-accent"> Python (FastAPI), TypeScript, and Next.js</span>. This website
                    was built using this new stack, serving as both a practical application of my skills and a living
                    resume.
                  </p>
                </div>
              </div>
            </section>
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="border border-white/10 p-4 rounded-lg bg-white/5">
                <h3 className="text-xs font-mono uppercase text-space-secondary mb-2">Core Tech</h3>
                <p className="text-sm text-white/60">Ruby on Rails, React, React Native</p>
              </div>
              <div className="border border-white/10 p-4 rounded-lg bg-white/5">
                <h3 className="text-xs font-mono uppercase text-space-accent mb-2">Exploring</h3>
                <p className="text-sm text-white/60">Python, FastAPI, Next.js, TypeScript</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h2
            className="
              text-4xl font-display uppercase tracking-[0.2em] text-white mb-8
              border-b border-space-secondary/30 pb-4 text-center
            "
          >
            My Tech Stack
          </h2>
          {isAdmin && (
            <div className="flex justify-end pb-6">
              <Button onClick={openCreate} disabled={isLoading}>
                + Add
              </Button>
            </div>
          )}
          {isLoading && <p className="text-white/60">Loading technologies...</p>}
          {isError && (
            <div className="space-y-2">
              <p className="text-sm text-space-accent">Failed to load technologies.</p>
              <p className="text-xs text-white/50">{error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
          )}
          {!isLoading &&
            !isError &&
            (technologies && technologies.length > 0 ? (
              <TechStack technologies={technologies} openEdit={openEdit} />
            ) : (
              <p className="text-white/60">No technologies yet.</p>
            ))}
        </div>
      </main>
      <TechStackModal
        key={editingTech?.id ?? "new"}
        isOpen={isModalOpen}
        mode={modalMode}
        initialTech={editingTech}
        onClose={closeModal}
      />
    </>
  )
}
