import { logger } from '@core/utils'
import { ProjectGFDueDateCancelled } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancières, GarantiesFinancièresProjector } from '../garantiesFinancières.model'

export default GarantiesFinancièresProjector.on(
  ProjectGFDueDateCancelled,
  async (évènement, transaction) => {
    const {
      payload: { projectId: projetId },
    } = évènement

    const entréeExistante = await GarantiesFinancières.findOne({ where: { projetId }, transaction })

    if (!entréeExistante) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectGFDueDateCancelled : ligne non trouvée`,
          {
            évènement,
            nomProjection: 'GarantiesFinancières',
          }
        )
      )
      return
    }

    await GarantiesFinancières.destroy({ where: { projetId }, transaction })

    try {
      const {
        id,
        statut,
        soumisesALaCandidature,
        fichierId,
        dateEnvoi,
        envoyéesPar,
        dateConstitution,
        dateEchéance,
        validéesLe,
        validéesPar,
      } = entréeExistante
      await GarantiesFinancières.create(
        {
          id,
          projetId,
          statut,
          soumisesALaCandidature,
          ...(envoyéesPar && { envoyéesPar }),
          ...(dateEchéance && { dateEchéance }),
          ...(dateEnvoi && { dateEnvoi }),
          ...(dateConstitution && {
            dateConstitution,
          }),
          ...(fichierId && { fichierId }),
          ...(validéesLe && { validéesLe }),
          ...(validéesPar && { validéesPar }),
        },
        { transaction }
      )
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectGFDueDateCancelled : création d'une nouvelle entrée`,
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
