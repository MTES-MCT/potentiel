import { logger } from '@core/utils'
import { RejetRecoursAnnulé } from '@modules/demandeModification'

export const onRejetRecoursAnnulé =
  (models) =>
  async ({ payload, occurredAt }: RejetRecoursAnnulé) => {
    const { demandeRecoursId } = payload
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
            id: demandeRecoursId,
          },
        }
      )
    } catch (e) {
      logger.error(e)
    }
  }
