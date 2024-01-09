import { IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import { OrderEditService } from "../../../../services"
import {
  defaultOrderEditFields,
  defaultOrderEditRelations,
} from "../../../../types/order-edit"

/**
 * @oas [post] /admin/order-edits/{id}
 * operationId: "PostOrderEditsOrderEdit"
 * summary: "Update an Order Edit"
 * description: "Update an Order Edit's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the OrderEdit.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostOrderEditsOrderEditReq"
 * x-codegen:
 *   method: update
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orderEdits.update(orderEditId, {
 *         internal_note: "internal reason XY"
 *       })
 *       .then(({ order_edit }) => {
 *         console.log(order_edit.id)
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminUpdateOrderEdit } from "medusa-react"
 *
 *       type Props = {
 *         orderEditId: string
 *       }
 *
 *       const OrderEdit = ({ orderEditId }: Props) => {
 *         const updateOrderEdit = useAdminUpdateOrderEdit(
 *           orderEditId,
 *         )
 *
 *         const handleUpdate = (
 *           internalNote: string
 *         ) => {
 *           updateOrderEdit.mutate({
 *             internal_note: internalNote
 *           }, {
 *             onSuccess: ({ order_edit }) => {
 *               console.log(order_edit.internal_note)
 *             }
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default OrderEdit
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/order-edits/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "internal_note": "internal reason XY"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Order Edits
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrderEditsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params
  const { validatedBody } = req as {
    validatedBody: AdminPostOrderEditsOrderEditReq
  }

  const orderEditService: OrderEditService =
    req.scope.resolve("orderEditService")

  const manager: EntityManager = req.scope.resolve("manager")

  const updatedOrderEdit = await manager.transaction(
    async (transactionManager) => {
      return await orderEditService
        .withTransaction(transactionManager)
        .update(id, validatedBody)
    }
  )

  let orderEdit = await orderEditService.retrieve(updatedOrderEdit.id, {
    select: defaultOrderEditFields,
    relations: defaultOrderEditRelations,
  })
  orderEdit = await orderEditService.decorateTotals(orderEdit)

  res.status(200).json({ order_edit: orderEdit })
}

/**
 * @schema AdminPostOrderEditsOrderEditReq
 * type: object
 * description: "The details to update of the order edit."
 * properties:
 *   internal_note:
 *     description: An optional note to create or update in the order edit.
 *     type: string
 */
export class AdminPostOrderEditsOrderEditReq {
  @IsOptional()
  @IsString()
  internal_note?: string
}
