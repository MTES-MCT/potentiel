import { Op } from 'sequelize'
import { errAsync, ResultAsync } from '../../../core/utils'
import { GetProjectIdsForPeriode } from '../../../modules/project/queries'
import { InfraNotAvailableError } from '../../../modules/shared'

export const makeGetProjectIdsForPeriode = (models): GetProjectIdsForPeriode => ({
  appelOffreId,
  periodeId,
}) => {
  const { Project } = models
  if (!Project) return errAsync(new InfraNotAvailableError())

  return ResultAsync.fromPromise(
    Project.findAll({
      where: { notifiedOn: { [Op.ne]: 0 }, appelOffreId, periodeId },
      attributes: ['id'],
    }),
    () => new InfraNotAvailableError()
  ).map((projects: any) => projects.map((project) => project.id))
}
