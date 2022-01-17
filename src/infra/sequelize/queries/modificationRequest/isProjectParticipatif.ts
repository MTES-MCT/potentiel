import { err, ok, wrapInfra } from '@core/utils'
import { IsProjectParticipatif } from '@modules/modificationRequest'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'

const { Project } = models

export const isProjectParticipatif: IsProjectParticipatif = (projectId) => {
  return wrapInfra(
    Project.findByPk(projectId, {
      attributes: ['isFinancementParticipatif', 'isInvestissementParticipatif'],
    })
  ).andThen((projectRaw: any) => {
    if (!projectRaw) return err(new EntityNotFoundError())

    const { isFinancementParticipatif, isInvestissementParticipatif } = projectRaw.get()

    return ok(isFinancementParticipatif || isInvestissementParticipatif)
  })
}
