import { logger } from '@core/utils'
import { ChangementDePuissanceDemandé } from '@modules/demandeModification'

export const onChangementDePuissanceDemandé =
  (models) =>
  async ({
    payload: {
      demandeId,
      projetId,
      demandéPar,
      fileId,
      autorité,
      cahierDesCharges,
      puissance,
      puissanceAuMomentDuDepot,
      justification,
    },
    occurredAt,
  }: ChangementDePuissanceDemandé) => {
    const { ModificationRequest } = models

    try {
      await ModificationRequest.create({
        id: demandeId,
        projectId: projetId,
        requestedOn: occurredAt.getTime(),
        versionDate: occurredAt,
        status: 'information validée',
        type: 'puissance',
        userId: demandéPar,
        puissance,
        puissanceAuMomentDuDepot,
        justification,
        fileId,
        producteur: undefined,
        actionnaire: undefined,
        fournisseurs: undefined,
        evaluationCarbone: undefined,
        authority: autorité,
        cahierDesCharges,
      })
    } catch (e) {
      logger.error(e)
      logger.info(
        'Error: onChangementDePuissanceDemandé projection failed to update project :',
        event
      )
    }
  }
