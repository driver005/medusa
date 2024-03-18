import { UpdatePriceListWorkflowInputDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import {
  updatePriceListsStep,
  upsertPriceListPricesStep,
  validatePriceListsStep,
  validateVariantPriceLinksStep,
} from "../steps"

type WorkflowInput = { price_lists_data: UpdatePriceListWorkflowInputDTO[] }

export const updatePriceListsWorkflowId = "update-price-lists"
export const updatePriceListsWorkflow = createWorkflow(
  updatePriceListsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    const [priceListsMap, variantPriceMap] = parallelize(
      validatePriceListsStep(input.price_lists_data),
      validateVariantPriceLinksStep(input.price_lists_data)
    )

    const updatePricesInput = transform(
      { priceListsMap, variantPriceMap, input },
      (data) => ({
        data: data.input.price_lists_data,
        price_lists_map: data.priceListsMap,
        variant_price_map: data.variantPriceMap,
      })
    )

    upsertPriceListPricesStep(updatePricesInput)

    const updatePriceListInput = transform({ input }, (data) => {
      return data.input.price_lists_data.map((priceListData) => {
        delete priceListData.prices

        return priceListData
      })
    })

    updatePriceListsStep(updatePriceListInput)
  }
)
