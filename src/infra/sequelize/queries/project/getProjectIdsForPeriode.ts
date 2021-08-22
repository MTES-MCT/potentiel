import { Op } from 'sequelize'
import { ResultAsync } from '../../../../core/utils'
import { GetProjectIdsForPeriode } from '../../../../modules/project/queries'
import { InfraNotAvailableError } from '../../../../modules/shared'
import models from '../../models'

const { Project } = models
export const getProjectIdsForPeriode: GetProjectIdsForPeriode = ({
  appelOffreId,
  periodeId,
  familleId,
}) => {
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
