import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { DélaiAnnulé } from '@modules/demandeModification'

export const onDélaiAnnulé = (models) => async (évènement: DélaiAnnulé) => {
  const {
    payload: { demandeDélaiId, annuléPar },
    occurredAt,
  } = évènement
  try {
    const ModificationRequestModel = models.ModificationRequest

    await ModificationRequestModel.update(
      {
        status: 'annulée',
        cancelledBy: annuléPar,
        cancelledOn: occurredAt.getTime(),
        versionDate: occurredAt,
      },
      {
        where: {
          id: demandeDélaiId,
        },
      }
    )
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(`Erreur lors du traitement de l'évènement DélaiAnnulé`, {
        nomProjection: 'ProjectEventProjector.onDélaiAnnulé',
        evenement: évènement,
      })
    )
  }
}
