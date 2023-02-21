import { errAsync, ok, okAsync, wrapInfra } from '@core/utils'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'
import {
  GetProjectDataForModifierIdentifiantGestionnaireReseauPage,
  ProjectDataForModifierIdentifiantGestionnaireReseauPage,
} from '@modules/project'
import { Raccordements } from '@infra/sequelize/projectionsNext'
import { getProjectAppelOffre } from '@config/queryProjectAO.config'

const { Project } = models

export const getProjectDataForModifierIdentifiantGestionnaireReseauPage: GetProjectDataForModifierIdentifiantGestionnaireReseauPage =
  (projectId) =>
    wrapInfra(
      Project.findByPk(projectId, {
        attributes: [
          'id',
          'appelOffreId',
          'communeProjet',
          'departementProjet',
          'familleId',
          'notifiedOn',
          'nomProjet',
          'nomCandidat',
          'regionProjet',
          'periodeId',
          'puissance',
        ],
        include: [
          {
            model: Raccordements,
            as: 'raccordements',
            attributes: ['identifiantGestionnaire'],
          },
        ],
      })
    )
      .andThen((projet) => {
        if (!projet) {
          return errAsync(new EntityNotFoundError())
        }

        const { appelOffreId, periodeId, familleId } = projet
        const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

        if (!appelOffre) {
          return errAsync(new EntityNotFoundError())
        }

        return okAsync({ projet, appelOffre })
      })
      .andThen(({ projet, appelOffre }) => {
        const pageProps: ProjectDataForModifierIdentifiantGestionnaireReseauPage = {
          id: projet.id,
          appelOffreId: projet.appelOffreId,
          communeProjet: projet.communeProjet,
          departementProjet: projet.departementProjet,
          familleId: projet.familleId,
          notifiedOn: projet.notifiedOn,
          nomCandidat: projet.nomCandidat,
          nomProjet: projet.nomProjet,
          regionProjet: projet.regionProjet,
          periodeId: projet.periodeId,
          puissance: projet.puissance,
          unitePuissance: appelOffre.unitePuissance,
          ...(projet.raccordements?.identifiantGestionnaire && {
            identifiantGestionnaire: projet.raccordements.identifiantGestionnaire,
          }),
        }

        return ok(pageProps)
      })
