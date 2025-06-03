import { getProjectAppelOffre } from '../../../../../../config/queryProjectAO.config';
import { ListerProjets } from '../../../../../../modules/project';
import { makePaginatedList, mapToOffsetAndLimit } from '../../../pagination';
import { mapToFindOptions } from '../../helpers/mapToFindOptions';
import { Op } from 'sequelize';
import { UserProjects, Project } from '../../../../projectionsNext';
import { getProjetsAvecAppelOffre } from './_utils/getProjetsAvecAppelOffre';

const attributes = [
  'id',
  'appelOffreId',
  'periodeId',
  'familleId',
  'numeroCRE',
  'nomProjet',
  'potentielIdentifier',
  'communeProjet',
  'departementProjet',
  'regionProjet',
  'nomCandidat',
  'nomRepresentantLegal',
  'email',
  'puissance',
  'prixReference',
  'evaluationCarbone',
  'classe',
  'abandonedOn',
  'notifiedOn',
  'isFinancementParticipatif',
  'isInvestissementParticipatif',
  'actionnariat',
];

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
    attributes,
  });

  return makePaginatedList(getProjetsAvecAppelOffre(résultat.rows), résultat.count, pagination);
};
