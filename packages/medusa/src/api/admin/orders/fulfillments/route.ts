import { remoteQueryObjectFromString } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  // TODO: Workflow fulfill items, create fulfillments - v1.x - packages/medusa/src/api/routes/admin/orders/create-fulfillment.ts

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  const [order] = await remoteQuery(queryObject)
  res.status(200).json({ order })
}
