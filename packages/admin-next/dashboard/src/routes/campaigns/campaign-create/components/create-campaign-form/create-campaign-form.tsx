import { zodResolver } from "@hookform/resolvers/zod"
import { Button, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { CampaignBudgetTypeValues } from "@medusajs/types"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreateCampaign } from "../../../../../hooks/api/campaigns"
import { CreateCampaignFormFields } from "../../../common/components/create-campaign-form-fields"

export const CreateCampaignSchema = zod.object({
  name: zod.string().min(1),
  description: zod.string().optional(),
  campaign_identifier: zod.string().min(1),
  starts_at: zod.date().optional(),
  ends_at: zod.date().optional(),
  budget: zod
    .object({
      limit: zod.number().min(0).optional().nullable(),
      type: zod.enum(["spend", "usage"]),
      currency_code: zod.string().optional().nullable(),
    })
    .refine((data) => data.type !== "spend" || data.currency_code, {
      path: ["currency_code"],
      message: `required field`,
    }),
})

export const defaultCampaignValues = {
  name: "",
  description: "",
  campaign_identifier: "",
  budget: {
    type: "spend" as CampaignBudgetTypeValues,
    currency_code: null,
    limit: null,
  },
}

export const CreateCampaignForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { mutateAsync, isPending } = useCreateCampaign()

  const form = useForm<zod.infer<typeof CreateCampaignSchema>>({
    defaultValues: defaultCampaignValues,
    resolver: zodResolver(CreateCampaignSchema),
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        name: data.name,
        description: data.description,
        campaign_identifier: data.campaign_identifier,
        starts_at: data.starts_at,
        ends_at: data.ends_at,
        budget: {
          type: data.budget.type,
          limit: data.budget.limit ? data.budget.limit : undefined,
          currency_code: data.budget.currency_code,
        },
      },
      {
        onSuccess: ({ campaign }) => {
          toast.success(t("general.success"), {
            description: t("campaigns.create.successToast", {
              name: campaign.name,
            }),
            dismissLabel: t("actions.close"),
          })
          handleSuccess(`/campaigns/${campaign.id}`)
        },
        onError: (error) => {
          toast.error(t("general.error"), {
            description: error.message,
            dismissLabel: t("actions.close"),
          })
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit}>
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>

            <Button
              size="small"
              variant="primary"
              type="submit"
              isLoading={isPending}
            >
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Header>

        <RouteFocusModal.Body className="flex flex-col items-center py-16">
          <CreateCampaignFormFields form={form} />
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
