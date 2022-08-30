import { logger } from '@core/utils'
import { RejetChangementDePuissanceAnnulé } from '@modules/demandeModification'

export const onRejetChangementDePuissanceAnnulé =
  (models) =>
  async ({ payload, occurredAt }: RejetChangementDePuissanceAnnulé) => {
    const { demandeChangementDePuissanceId } = payload
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
            id: demandeChangementDePuissanceId,
          },
        }
      )
    } catch (e) {
      logger.error(e)
    }
  }
