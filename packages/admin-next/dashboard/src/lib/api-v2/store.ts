import { adminStoreKeys, useAdminCustomQuery } from "medusa-react"

export const useV2Store = ({ initialData }: { initialData?: any }) => {
  const { data, isLoading, isError, error } = useAdminCustomQuery(
    "/admin/stores",
    adminStoreKeys.details(),
    {},
    { initialData }
  )

  const store = data.stores[0]

  return { store, isLoading, isError, error }
}
