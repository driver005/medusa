import { PaginatedResponse } from "../../../common"

/**
 * @experimental
 */
export interface ShippingProfileResponse {
  id: string
  name: string
  type: string
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface AdminShippingProfileResponse {
  shipping_profile: ShippingProfileResponse
}

export interface AdminShippingProfilesResponse extends PaginatedResponse {
  shipping_profiles: ShippingProfileResponse[]
}
