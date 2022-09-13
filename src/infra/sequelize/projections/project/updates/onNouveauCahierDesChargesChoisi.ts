import { logger } from '@core/utils'
import { Projections } from '@infra/sequelize/models'
import { NouveauCahierDesChargesChoisi } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'

type OnNouveauCahierDesChargesChoisi = (
  projections: Projections
) => (événement: NouveauCahierDesChargesChoisi) => Promise<void>

export const onNouveauCahierDesChargesChoisi: OnNouveauCahierDesChargesChoisi =
  ({ Project }) =>
  async (événement) => {
    const {
      payload: { projetId: id },
    } = événement
    try {
      await Project.update({ newRulesOptIn: true }, { where: { id } })
    } catch (cause) {
      logger.error(
        new ProjectionEnEchec(
          'Erreur lors de la projection du nouveau cahier des charges choisi',
          {
            nomProjection: 'onNouveauCahierDesChargesChoisi',
            évènement: événement,
          },
          cause
        )
      )
    }
  }
