import { remoteQueryObjectFromString } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  // TODO: cancel order - v1.x - packages/medusa/src/api/routes/admin/orders/cancel-order.ts

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  const [order] = await remoteQuery(queryObject)
  res.status(200).json({ order })
}
