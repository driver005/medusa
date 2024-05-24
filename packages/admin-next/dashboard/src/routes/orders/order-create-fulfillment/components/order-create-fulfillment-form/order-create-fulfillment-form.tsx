import React, { useEffect, useState } from "react"
import * as zod from "zod"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"

import { useForm, useWatch } from "react-hook-form"
import { Alert, Button, Select, toast } from "@medusajs/ui"
import { OrderDTO } from "@medusajs/types"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { CreateFulfillmentSchema } from "./constants"
import { Form } from "../../../../../components/common/form"
import { OrderCreateFulfillmentItem } from "./order-create-fulfillment-item"
import { getFulfillableQuantity } from "../../../../../lib/order-item"
import { useCreateFulfillment } from "../../../../../hooks/api/fulfillment"
import { useStockLocations } from "../../../../../hooks/api/stock-locations"
import { useFulfillmentProviders } from "../../../../../hooks/api/fulfillment-providers"
import { cleanNonValues, pick } from "../../../../../lib/common"

type OrderCreateFulfillmentFormProps = {
  order: OrderDTO
}

export function OrderCreateFulfillmentForm({
  order,
}: OrderCreateFulfillmentFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { mutateAsync: createOrderFulfillment, isLoading: isMutating } =
    useCreateFulfillment()

  const { fulfillment_providers } = useFulfillmentProviders({
    region_id: order.region_id,
  })

  const [fulfillableItems, setFulfillableItems] = useState(() =>
    order.items.filter((item) => getFulfillableQuantity(item) > 0)
  )

  const form = useForm<zod.infer<typeof CreateFulfillmentSchema>>({
    defaultValues: {
      quantity: fulfillableItems.reduce((acc, item) => {
        acc[item.id] = getFulfillableQuantity(item)
        return acc
      }, {} as Record<string, number>),
      // send_notification: !order.no_notification,
    },
    resolver: zodResolver(CreateFulfillmentSchema),
  })

  const { stock_locations = [] } = useStockLocations()

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await createOrderFulfillment({
        location_id: data.location_id,
        /**
         * TODO: send notification flag
         */
        // no_notification: !data.send_notification,
        delivery_address: cleanNonValues(
          pick(order.shipping_address, [
            "first_name",
            "last_name",
            "phone",
            "company",
            "address_1",
            "address_2",
            "city",
            "country_code",
            "province",
            "postal_code",
            "metadata",
          ])
        ), // TODO: this should be pulled from order in the workflow
        provider_id: fulfillment_providers[0]?.id,
        items: Object.entries(data.quantity)
          .filter(([, value]) => !!value)
          .map(([item_id, quantity]) => {
            const item = order.items.find((i) => i.id === item_id)

            return {
              quantity,
              line_item_id: item_id,
              title: item.title,
              barcode: item.variant.barcode || "",
              sku: item.variant_sku || "",
            }
          }),
        // TODO: should be optional in the enpoint?
        labels: [
          {
            tracking_number: "TODO",
            tracking_url: "TODO",
            label_url: "TODO",
          },
        ],
        order: {}, // TODO ?
        order_id: order.id, // TEMP link for now
      })

      handleSuccess(`/orders/${order.id}`)

      toast.success(t("general.success"), {
        description: t("orders.fulfillment.toast.created"),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  })

  useEffect(() => {
    if (stock_locations?.length) {
      form.setValue("location_id", stock_locations[0].id)
    }
  }, [stock_locations?.length])

  const onItemRemove = (itemId: string) => {
    setFulfillableItems((state) => state.filter((i) => i.id !== itemId))
    form.unregister(`quantity.${itemId}`)
  }

  const resetItems = () => {
    const items = order.items.filter((item) => getFulfillableQuantity(item) > 0)
    setFulfillableItems(items)

    items.forEach((i) =>
      form.register(`quantity.${i.id}`, { value: getFulfillableQuantity(i) })
    )
    form.clearErrors("root")
  }

  const selectedLocationId = useWatch({
    name: "location_id",
    control: form.control,
  })

  useEffect(() => {
    if (!fulfillableItems.length) {
      form.setError("root", {
        type: "manual",
        message: t("orders.fulfillment.error.noItems"),
      })
    }
  }, [fulfillableItems.length])

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isMutating}>
              {t("orders.fulfillment.create")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center divide-y overflow-y-auto">
          <div className="flex size-full flex-col items-center overflow-auto p-16">
            <div className="flex w-full max-w-[736px] flex-col justify-center px-2 pb-2">
              <div className="flex flex-col divide-y">
                <div className="flex-1">
                  <Form.Field
                    control={form.control}
                    name="location_id"
                    render={({ field: { onChange, ref, ...field } }) => {
                      return (
                        <Form.Item>
                          <Form.Label>{t("fields.location")}</Form.Label>
                          <Form.Hint>
                            {t("orders.fulfillment.locationDescription")}
                          </Form.Hint>
                          <Form.Control>
                            <Select onValueChange={onChange} {...field}>
                              <Select.Trigger
                                className="bg-ui-bg-base"
                                ref={ref}
                              >
                                <Select.Value />
                              </Select.Trigger>
                              <Select.Content>
                                {stock_locations.map((l) => (
                                  <Select.Item key={l.id} value={l.id}>
                                    {l.name}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select>
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />

                  <Form.Item className="mt-8">
                    <Form.Label>
                      {t("orders.fulfillment.itemsToFulfill")}
                    </Form.Label>
                    <Form.Hint>
                      {t("orders.fulfillment.itemsToFulfillDesc")}
                    </Form.Hint>

                    <div className="flex flex-col gap-y-1">
                      {fulfillableItems.map((item) => (
                        <OrderCreateFulfillmentItem
                          key={item.id}
                          form={form}
                          item={item}
                          onItemRemove={onItemRemove}
                          locationId={selectedLocationId}
                          currencyCode={order.currency_code}
                        />
                      ))}
                    </div>
                  </Form.Item>
                  {form.formState.errors.root && (
                    <Alert
                      variant="error"
                      dismissible={false}
                      className="flex items-center"
                      classNameInner="flex justify-between flex-1 items-center"
                    >
                      {form.formState.errors.root.message}
                      <Button
                        variant="transparent"
                        size="small"
                        type="button"
                        onClick={resetItems}
                      >
                        {t("actions.reset")}
                      </Button>
                    </Alert>
                  )}
                </div>

                {/*<div className="mt-8 pt-8 ">*/}
                {/*  <Form.Field*/}
                {/*    control={form.control}*/}
                {/*    name="send_notification"*/}
                {/*    render={({ field: { onChange, value, ...field } }) => {*/}
                {/*      return (*/}
                {/*        <Form.Item>*/}
                {/*          <div className="flex items-center justify-between">*/}
                {/*            <Form.Label>*/}
                {/*              {t("orders.returns.sendNotification")}*/}
                {/*            </Form.Label>*/}
                {/*            <Form.Control>*/}
                {/*              <Form.Control>*/}
                {/*                <Switch*/}
                {/*                  checked={!!value}*/}
                {/*                  onCheckedChange={onChange}*/}
                {/*                  {...field}*/}
                {/*                />*/}
                {/*              </Form.Control>*/}
                {/*            </Form.Control>*/}
                {/*          </div>*/}
                {/*          <Form.Hint className="!mt-1">*/}
                {/*            {t("orders.returns.sendNotificationHint")}*/}
                {/*          </Form.Hint>*/}
                {/*          <Form.ErrorMessage />*/}
                {/*        </Form.Item>*/}
                {/*      )*/}
                {/*    }}*/}
                {/*  />*/}
                {/*</div>*/}
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
