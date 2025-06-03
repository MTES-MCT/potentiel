import { getProjectAppelOffre } from '../../../../../../config/queryProjectAO.config';
import { ListerProjets } from '../../../../../../modules/project';
import { makePaginatedList, mapToOffsetAndLimit } from '../../../pagination';
import { mapToFindOptions } from '../../helpers/mapToFindOptions';
import { Op } from 'sequelize';
import { UserDreal, Project } from '../../../../projectionsNext';
import { logger } from '../../../../../../core/utils';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getProjetsAvecAppelOffre } from './_utils/getProjetsAvecAppelOffre';

const attributes = [
  'id',
  'appelOffreId',
  'periodeId',
  'familleId',
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
  'classe',
  'abandonedOn',
  'notifiedOn',
  'isFinancementParticipatif',
  'isInvestissementParticipatif',
  'actionnariat',
];

export const listerProjetsPourDreal: ListerProjets = async ({
  pagination,
  filtres,
  user: { id: userId },
}) => {
  const findOptions = filtres && mapToFindOptions(filtres);

  const utilisateur = await UserDreal.findOne({ where: { userId }, attributes: ['dreal'] });

  if (!utilisateur?.dreal) {
    logger.warning('Utilisateur DREAL sans région', { userId });
    return makePaginatedList([], 0, pagination);
  }

  const résultat = await Project.findAndCountAll({
    where: {
      ...findOptions?.where,
      notifiedOn: { [Op.gt]: 0 },
      regionProjet: {
        [Op.substring]: utilisateur.dreal,
      },
    },
    ...mapToOffsetAndLimit(pagination),
    attributes,
  });

  return makePaginatedList(getProjetsAvecAppelOffre(résultat.rows), résultat.count, pagination);
};
