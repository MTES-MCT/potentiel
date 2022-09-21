import { logger } from '@core/utils'
import { formatCahierDesChargesActuel } from '@entities'
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
      payload: { projetId: id, paruLe, alternatif },
    } = événement
    try {
      await Project.update(
        { cahierDesChargesActuel: formatCahierDesChargesActuel({ paruLe, alternatif }) },
        { where: { id } }
      )
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
