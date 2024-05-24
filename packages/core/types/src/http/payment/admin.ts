import {
  BasePaymentCollection,
  BasePaymentCollectionFilters,
  BasePaymentProvider,
  BasePaymentProviderFilters,
  BasePaymentSession,
  BasePaymentSessionFilters,
} from "./common"

export interface AdminPaymentProvider extends BasePaymentProvider {
  is_enabled: boolean
}

export interface AdminPaymentCollection extends BasePaymentCollection {}
export interface AdminPaymentSession extends BasePaymentSession {}

export interface AdminPaymentProviderFilters
  extends BasePaymentProviderFilters {
  is_enabled?: boolean
}
export interface AdminPaymentCollectionFilters
  extends BasePaymentCollectionFilters {}
export interface AdminPaymentSessionFilters extends BasePaymentSessionFilters {}
