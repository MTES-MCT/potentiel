import { logger } from '@core/utils'
import { formatCahierDesChargesRéférence } from '@entities'
import { Projections } from '@infra/sequelize/models'
import { CahierDesChargesChoisi } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'

type OnCahierDesChargesChoisi = (
  projections: Projections
) => (événement: CahierDesChargesChoisi) => Promise<void>

export const onCahierDesChargesChoisi: OnCahierDesChargesChoisi =
  ({ Project }) =>
  async (évènement) => {
    const { payload } = évènement
    try {
      await Project.update(
        {
          cahierDesChargesActuel: formatCahierDesChargesRéférence(payload),
        },
        { where: { id: payload.projetId } }
      )
    } catch (cause) {
      logger.error(
        new ProjectionEnEchec(
          'Erreur lors de la projection du nouveau cahier des charges choisi',
          {
            nomProjection: 'onCahierDesChargesChoisi',
            évènement,
          },
          cause
        )
      )
    }
  }
