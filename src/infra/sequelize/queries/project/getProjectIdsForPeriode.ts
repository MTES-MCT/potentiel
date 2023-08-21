import { Op } from 'sequelize';
import { ResultAsync } from '../../../../core/utils';
import { GetProjectIdsForPeriode } from '../../../../modules/project';
import { InfraNotAvailableError } from '../../../../modules/shared';
import { Project } from '../../projectionsNext';

export const getProjectIdsForPeriode: GetProjectIdsForPeriode = ({
  appelOffreId,
  periodeId,
  familleId,
}) => {
  const where: any = { notifiedOn: { [Op.ne]: 0 }, appelOffreId, periodeId };
  if (familleId) where.familleId = familleId;

  return ResultAsync.fromPromise(
    Project.findAll({
      where,
      attributes: ['id'],
    }),
    () => new InfraNotAvailableError(),
  ).map((projects: any) => projects.map((project) => project.id));
};
