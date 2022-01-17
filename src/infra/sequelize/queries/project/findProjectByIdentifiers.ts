import { wrapInfra } from '@core/utils'
import { FindProjectByIdentifiers } from '@modules/project'
import models from '../../models'
const { Project } = models

export const findProjectByIdentifiers: FindProjectByIdentifiers = (args) => {
  return wrapInfra(Project.findOne({ where: args })).map((rawItem: any) =>
    rawItem ? rawItem.get().id : null
  )
}
