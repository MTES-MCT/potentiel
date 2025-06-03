import { ListerProjets } from '../../../../../../modules/project';
import { makePaginatedList, mapToOffsetAndLimit } from '../../../pagination';
import { mapToFindOptions } from '../../helpers/mapToFindOptions';
import { Op } from 'sequelize';
import { Project } from '../../../../projectionsNext';
import { getProjetsAvecAppelOffre } from './_utils/getProjetsAvecAppelOffre';
import { allAttributes } from './_utils';

const attributes = allAttributes.filter(
  (a) =>
    ![
      'prixReference',
      'evaluationCarbone',
      'isFinancementParticipatif',
      'isInvestissementParticipatif',
      'actionnariat',
    ].includes(a),
);

export const listerProjetsPourCaisseDesDépôts: ListerProjets = async ({ pagination, filtres }) => {
  const findOptions = filtres && mapToFindOptions(filtres);

  const résultat = await Project.findAndCountAll({
    where: {
      ...findOptions?.where,
      notifiedOn: { [Op.gt]: 0 },
    },
    ...mapToOffsetAndLimit(pagination),
    attributes,
  });

  return makePaginatedList(getProjetsAvecAppelOffre(résultat.rows), résultat.count, pagination);
};
