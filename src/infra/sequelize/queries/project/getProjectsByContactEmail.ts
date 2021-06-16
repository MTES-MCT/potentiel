import { ResultAsync } from '../../../../core/utils'
import { GetProjectsByContactEmail } from '../../../../modules/project'
import { InfraNotAvailableError } from '../../../../modules/shared'
import models from '../../models'

const { Project } = models

export const getProjectsByContactEmail: GetProjectsByContactEmail = (email) => {
  return ResultAsync.fromPromise(
    Project.findAll({
      where: { email },
      attributes: ['id'],
    }),
    () => new InfraNotAvailableError()
  ).map((projects: any) => projects.map((project) => project.id))
}
