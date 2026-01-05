export type UserRole = "admin" | "user"

export interface User {
  id: number
  username: string
  role: UserRole
}

export type LoginRequest = {
  username: string
  password: string
}
