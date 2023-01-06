import { logger } from '@core/utils'
import { ChangementDePuissanceDemandé } from '@modules/demandeModification'
import { ProjectionEnEchec } from '@modules/shared'

export const onChangementDePuissanceDemandé =
  (models) => async (évènement: ChangementDePuissanceDemandé) => {
    const {
      payload: {
        demandeChangementDePuissanceId,
        autorité,
        projetId,
        puissance,
        fichierId,
        demandéPar,
        justification,
        puissanceAuMomentDuDepot,
        cahierDesCharges,
      },
      occurredAt,
    } = évènement

    try {
      const { ModificationRequest } = models
      await ModificationRequest.create({
        id: demandeChangementDePuissanceId,
        projectId: projetId,
        type: 'puissance',
        requestedOn: occurredAt.getTime(),
        versionDate: occurredAt,
        status: 'envoyée',
        fileId: fichierId,
        userId: demandéPar,
        justification,
        puissance,
        puissanceAuMomentDuDepot,
        authority: autorité,
        cahierDesCharges,
      })
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ChangementDePuissanceDemandé`,
          {
            nomProjection: 'ProjectEventProjector.onChangementDePuissanceDemandé',
            évènement,
          }
        )
      )
    }
  }
