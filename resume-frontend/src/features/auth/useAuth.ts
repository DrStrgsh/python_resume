import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { me, isAdmin, logout } from "@/features/auth/authApi"
import type { User } from "./auth.types"

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["auth-me"],
    queryFn: me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      router.push("/login")
      router.refresh()
    },
  })

  return {
    user,
    isLoading,
    error,
    isAdmin: isAdmin(user),
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  }
}
