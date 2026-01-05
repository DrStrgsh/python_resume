"use client"

import type { TechStackProps } from "./about.types"
import { useAuth } from "@/features/auth/useAuth"
import Button from "@/components/Button"
import { useTechMutations } from "@/features/technologies/useTechnologies"

export default function TechStack({ technologies, openEdit }: TechStackProps) {
  const { isAdmin } = useAuth()
  const { deleteTech } = useTechMutations()

  function handleDelete(id: number) {
    deleteTech({ id: id })
  }

  function calculateExperience(startYear: number): string {
    const currentYear = new Date().getFullYear()
    const years = currentYear - startYear

    if (years <= 0) return "Less then a year"

    return `${years} year${years == 1 ? "" : "s"}`
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="p-4 font-mono text-sm uppercase tracking-wider text-space-secondary">Technology</th>
            <th className="p-4 font-mono text-sm uppercase tracking-wider text-space-secondary text-right">
              Experience
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {technologies.map((tech) => (
            <tr key={tech.name} className="hover:bg-white/[0.02] transition-colors">
              <td className="p-4 text-white font-medium">{tech.name}</td>
              <td className="p-4 text-white/70 text-right font-mono">
                {calculateExperience(tech.start_year)}
                {isAdmin && (
                  <div className="flex gap-2 justify-end mt-1 text-sm text-space-secondary/70">
                    <Button variant="link" onClick={() => openEdit(tech)}>
                      Edit
                    </Button>
                    <Button variant="link" onClick={() => handleDelete(tech.id)}>
                      Delete
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
