import { logger } from '@core/utils'
import { RejetRecoursAnnulé } from '@modules/demandeModification'

export const onRejetRecoursAnnulé =
  (models) =>
  async ({ payload }: RejetRecoursAnnulé) => {
    const { demandeRecoursId } = payload
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
            id: demandeRecoursId,
          },
        }
      )
    } catch (e) {
      logger.error(e)
    }
  }
