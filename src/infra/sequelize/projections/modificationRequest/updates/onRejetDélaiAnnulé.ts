import { logger } from '@core/utils'
import { RejetDélaiAnnulé } from '@modules/demandeModification'

export const onRejetDélaiAnnulé =
  (models) =>
  async ({ payload, occurredAt }: RejetDélaiAnnulé) => {
    const { demandeDélaiId } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'envoyée',
          respondedBy: null,
          respondedOn: null,
          responseFileId: null,
          versionDate: occurredAt,
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
