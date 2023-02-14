import { err, ok, wrapInfra } from '@core/utils'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'
import {
  GetProjectDataForModifierIdentifiantGestionnaireReseauPage,
  ProjectDataForModifierIdentifiantGestionnaireReseauPage,
} from '@modules/project'

const { Project } = models

export const getProjectDataForModifierIdentifiantGestionnaireReseauPage: GetProjectDataForModifierIdentifiantGestionnaireReseauPage =
  (projectId) =>
    wrapInfra(
      Project.findByPk(projectId, {
        attributes: [
          'id',
          'numeroGestionnaire',
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
        ...(projet.numeroGestionnaire && { numeroGestionnaire: projet.numeroGestionnaire }),
      }

      return ok(pageProps)
    })
