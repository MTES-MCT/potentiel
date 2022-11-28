import { logger } from '@core/utils'
import { ProjectGFSubmitted } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancières, GarantiesFinancièresProjector } from '../garantiesFinancières.model'
import { UniqueEntityID } from '@core/domain'
import { models } from '../../../models'
import { getProjectAppelOffre } from '@config/queryProjectAO.config'

export default GarantiesFinancièresProjector.on(
  ProjectGFSubmitted,
  async (évènement, transaction) => {
    const {
      occurredAt,
      payload: { projectId: projetId, fileId, submittedBy, expirationDate, gfDate },
    } = évènement

    const entréeExistante = await GarantiesFinancières.findOne({ where: { projetId }, transaction })

    if (entréeExistante) {
      try {
        await GarantiesFinancières.update(
          {
            fichierId: fileId,
            statut: 'à traiter',
            envoyéPar: submittedBy,
            ...(expirationDate && { dateEchéance: expirationDate }),
            dateEnvoi: occurredAt,
            dateConstitution: gfDate,
          },
          { where: { projetId }, transaction }
        )
      } catch (error) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'évènement ProjectGFSubmitted : mise à jour de l'entrée GF du projet`,
            {
              évènement,
              nomProjection: 'GarantiesFinancières',
            },
            error
          )
        )
      }
      return
    }

    try {
      const { Project } = models
      const { appelOffreId, periodeId, familleId } = await Project.findOne({
        where: { id: projetId },
        transaction,
      })
      const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

      if (!appelOffre) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'évènement ProjectGFSubmitted : AO non trouvé`,
            {
              évènement,
              nomProjection: 'GarantiesFinancières',
            }
          )
        )
      }

      await GarantiesFinancières.create(
        {
          id: new UniqueEntityID().toString(),
          projetId,
          soumisALaCandidature:
            appelOffre?.famille?.soumisAuxGarantiesFinancieres === 'à la candidature' ||
            appelOffre?.soumisAuxGarantiesFinancieres === 'à la candidature',
          fichierId: fileId,
          statut: 'à traiter',
          envoyéPar: submittedBy,
          ...(expirationDate && { dateEchéance: expirationDate }),
          dateEnvoi: occurredAt,
          dateConstitution: gfDate,
        },
        { where: { projetId }, transaction }
      )
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectGFSubmitted : création d'une nouvelle entrée`,
          {
            évènement,
            nomProjection: 'GarantiesFinancières',
          },
          error
        )
      )
    }
  }
)
