import { Op } from 'sequelize'
import { errAsync, ResultAsync } from '../../../core/utils'
import { GetProjectIdsForPeriode } from '../../../modules/project/queries'
import { InfraNotAvailableError } from '../../../modules/shared'

export const makeGetProjectIdsForPeriode = (models): GetProjectIdsForPeriode => ({
  appelOffreId,
  periodeId,
  familleId,
}) => {
  const { Project } = models
  if (!Project) return errAsync(new InfraNotAvailableError())

  const where: any = { notifiedOn: { [Op.ne]: 0 }, appelOffreId, periodeId }
  if (familleId) where.familleId = familleId

  return ResultAsync.fromPromise(
    Project.findAll({
      where,
      attributes: ['id'],
    }),
    () => new InfraNotAvailableError()
  ).map((projects: any) => projects.map((project) => project.id))
}
