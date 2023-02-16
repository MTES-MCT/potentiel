import { err, ok, wrapInfra } from '@core/utils'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'
import {
  GetProjectDataForModifierIdentifiantGestionnaireReseauPage,
  ProjectDataForModifierIdentifiantGestionnaireReseauPage,
} from '@modules/project'
import { Raccordements } from '@infra/sequelize/projectionsNext'

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
        ],
        include: [
          {
            model: Raccordements,
            as: 'raccordements',
            attributes: ['identifiantGestionnaire'],
          },
        ],
      })
    ).andThen((projet) => {
      if (!projet) return err(new EntityNotFoundError())
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
        ...(projet.raccordements &&
          projet.raccordements.identifiantGestionnaire && {
            identifiantGestionnaire: projet.raccordements.identifiantGestionnaire,
          }),
      }

      return ok(pageProps)
    })
