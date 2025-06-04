import { getProjectAppelOffre } from '../../../../../../config/queryProjectAO.config';
import { ListerProjets } from '../../../../../../modules/project';
import { makePaginatedList, mapToOffsetAndLimit } from '../../../pagination';
import { mapToFindOptions } from '../../helpers/mapToFindOptions';
import { Op } from 'sequelize';
import { UserProjects, Project } from '../../../../projectionsNext';
import { getProjetsAvecAppelOffre } from './_utils/getProjetsAvecAppelOffre';
import { allAttributes } from './_utils';

export const listerProjetsPourPorteur: ListerProjets = async ({
  pagination,
  filtres,
  user: { id: userId },
}) => {
  const findOptions = filtres && mapToFindOptions(filtres);

  const résultat = await Project.findAndCountAll({
    subQuery: false,
    where: {
      ...findOptions?.where,
      '$users.userId$': userId,
      notifiedOn: { [Op.gt]: 0 },
    },
    include: [
      {
        model: UserProjects,
        as: 'users',
        attributes: [],
      },
    ],
    ...mapToOffsetAndLimit(pagination),
    attributes: allAttributes,
  });

  return makePaginatedList(getProjetsAvecAppelOffre(résultat.rows), résultat.count, pagination);
};
