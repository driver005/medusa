import { BaseFilterable } from "../../dal"
import { PromotionDTO } from "./promotion"
import { CreatePromotionRuleDTO } from "./promotion-rule"

export type ApplicationMethodType = "fixed" | "percentage"
export type ApplicationMethodTargetType = "order" | "shipping" | "item"
export type ApplicationMethodAllocation = "each" | "across"

export interface ApplicationMethodDTO {
  id: string
}

export interface CreateApplicationMethodDTO {
  type: ApplicationMethodType
  target_type: ApplicationMethodTargetType
  allocation?: ApplicationMethodAllocation
  value?: number
  max_quantity?: number
  promotion?: PromotionDTO | string
  target_rules?: CreatePromotionRuleDTO[]
}

export interface UpdateApplicationMethodDTO {
  id: string
}

export interface FilterableApplicationMethodProps
  extends BaseFilterable<FilterableApplicationMethodProps> {
  id?: string[]
  type?: ApplicationMethodType[]
  target_type?: ApplicationMethodTargetType[]
  allocation?: ApplicationMethodAllocation[]
}
