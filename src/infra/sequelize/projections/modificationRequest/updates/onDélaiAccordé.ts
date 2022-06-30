import { logger } from '@core/utils'
import { DélaiAccordé } from '@modules/demandeModification'

export const onDélaiAccordé =
  (models) =>
  async ({ payload, occurredAt }: DélaiAccordé) => {
    const { demandeDélaiId, dateAchèvementAccordée, fichierRéponseId, accordéPar } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'acceptée',
          respondedOn: occurredAt.getTime(),
          respondedBy: accordéPar,
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
          dateAchèvementAccordée,
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
