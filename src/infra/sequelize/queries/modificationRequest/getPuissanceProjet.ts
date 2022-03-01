import { err, ok, wrapInfra } from '@core/utils'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'

const { Project } = models

export const getPuissanceProjet = (projectId) => {
  return wrapInfra(
    Project.findByPk(projectId, {
      attributes: ['puissance'],
    })
  ).andThen((projectRaw: any) => {
    if (!projectRaw) return err(new EntityNotFoundError())

    const { puissance } = projectRaw.get()

    return ok(puissance)
  })
}
