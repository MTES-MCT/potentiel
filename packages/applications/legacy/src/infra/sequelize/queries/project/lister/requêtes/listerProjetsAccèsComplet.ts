import { ListerProjets } from '../../../../../../modules/project/queries';
import { Project } from '../../../../projectionsNext';
import { makePaginatedList, mapToOffsetAndLimit } from '../../../pagination';
import { mapToFindOptions } from '../../helpers/mapToFindOptions';

import { getProjetsAvecAppelOffre, allAttributes } from './_utils';

export const listerProjetsAccèsComplet: ListerProjets = async ({ pagination, filtres }) => {
  const findOptions = filtres && mapToFindOptions(filtres);

  const résultat = await Project.findAndCountAll({
    where: {
      ...findOptions?.where,
    },
    ...mapToOffsetAndLimit(pagination),
    attributes: allAttributes,
  });

  return makePaginatedList(getProjetsAvecAppelOffre(résultat.rows), résultat.count, pagination);
};
