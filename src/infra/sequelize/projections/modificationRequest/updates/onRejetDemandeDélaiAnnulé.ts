import { logger } from '@core/utils'
import { RejetDemandeDélaiAnnulé } from '@modules/demandeModification'

export const onRejetDemandeDélaiAnnulé =
  (models) =>
  async ({ payload }: RejetDemandeDélaiAnnulé) => {
    const { demandeDélaiId } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'envoyée',
          respondedBy: null,
          respondedOn: null,
        },
        {
          where: {
            id: demandeDélaiId,
          },
        }
      )
    } catch (e) {
      logger.error(e)
    }
  }
