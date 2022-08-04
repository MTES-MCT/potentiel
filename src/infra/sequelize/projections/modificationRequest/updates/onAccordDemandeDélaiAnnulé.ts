import { logger } from '@core/utils'
import { AccordDemandeDélaiAnnulé } from '@modules/demandeModification'

export const onAccordDemandeDélaiAnnulé =
  (models) =>
  async ({ payload }: AccordDemandeDélaiAnnulé) => {
    const { demandeDélaiId } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'envoyée',
          respondedBy: null,
          respondedOn: null,
          responseFileId: null,
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
