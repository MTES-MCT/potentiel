import { ListerProjets } from '../../../../../../modules/project';
import { Project } from '../../../../projectionsNext';
import { makePaginatedList, mapToOffsetAndLimit } from '../../../pagination';
import { mapToFindOptions } from '../../helpers/mapToFindOptions';
import { Op } from 'sequelize';
import { getProjetsAvecAppelOffre } from './_utils/getProjetsAvecAppelOffre';
import { allAttributes } from './_utils';

export const listerProjetsPourAdeme: ListerProjets = async ({ pagination, filtres }) => {
  const findOptions = filtres && mapToFindOptions(filtres);

  const résultat = await Project.findAndCountAll({
    where: {
      ...findOptions?.where,
      notifiedOn: { [Op.gt]: 0 },
    },
    ...mapToOffsetAndLimit(pagination),
    attributes: allAttributes.filter((a) => a !== 'prixReference'),
  });

  return makePaginatedList(getProjetsAvecAppelOffre(résultat.rows), résultat.count, pagination);
};
