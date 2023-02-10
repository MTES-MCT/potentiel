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
    wrapInfra(Project.findByPk(projectId)).andThen((projectRaw: any) => {
      if (!projectRaw) return err(new EntityNotFoundError())

      const { id, numeroGestionnaire } = projectRaw.get()

      if (!numeroGestionnaire) return err(new EntityNotFoundError())
      console.log('here', id, numeroGestionnaire)
      const pageProps: ProjectDataForModifierIdentifiantGestionnaireReseauPage = {
        id,
        numeroGestionnaire,
      }

      return ok(pageProps)
    })
