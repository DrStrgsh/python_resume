import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"

import { createTech, updateTech, deleteTech, getTech } from "./technologiesApi"
import { extractErrorMessage } from "@/lib/api"
import type { ApiError } from "@/lib/api"
import type { Tech, TechInput, UpdateTechProps, UseTechMutationsProps } from "./technologies.types"

export function useTech() {
  return useQuery<Tech[], ApiError>({
    queryKey: ["technologies"],
    queryFn: getTech,
    staleTime: 5 * 60 * 1000,
  })
}

export function useTechMutations({ onClose, setErrorMessage }: UseTechMutationsProps = {}) {
  const queryClient = useQueryClient()

  const handleError = (err: ApiError) => {
    const message = extractErrorMessage(err)
    toast.error(message)
    setErrorMessage?.(message)
  }

  const handleSuccess = async (message: string) => {
    await queryClient.invalidateQueries({ queryKey: ["technologies"] })
    toast.success(message)
    setErrorMessage?.(null)
    onClose?.()
  }

  const createMutation = useMutation<Tech, ApiError, TechInput>({
    mutationFn: createTech,
    onSuccess: () => handleSuccess("Tech created successfully"),
    onError: handleError,
  })

  const updateMutation = useMutation<Tech, ApiError, UpdateTechProps>({
    mutationFn: ({ id, input }) => updateTech(id, input),
    onSuccess: () => handleSuccess("Tech updated successfully"),
    onError: handleError,
  })

  const deleteMutation = useMutation<void, ApiError, { id: number }>({
    mutationFn: ({ id }) => deleteTech(id),
    onSuccess: () => handleSuccess("Tech deleted successfully"),
    onError: handleError,
  })

  return {
    createTech: createMutation.mutate,
    updateTech: updateMutation.mutate,
    deleteTech: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  }
}
