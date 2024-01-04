export enum PromotionType {
  STANDARD = "standard",
  BUYGET = "buyget",
}

export enum ApplicationMethodType {
  FIXED = "fixed",
  PERCENTAGE = "percentage",
}

export enum ApplicationMethodTargetType {
  ORDER = "order",
  SHIPPING = "shipping",
  ITEM = "item",
}

export enum ApplicationMethodAllocation {
  EACH = "each",
  ACROSS = "across",
}

export enum PromotionRuleOperator {
  GTE = "gte",
  LTE = "lte",
  GT = "gt",
  LT = "lt",
  EQ = "eq",
  NE = "ne",
  IN = "in",
}
