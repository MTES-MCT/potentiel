import { getProjectAppelOffre } from '../../../../../../config/queryProjectAO.config';
import { ListerProjets } from '../../../../../../modules/project';
import { makePaginatedList, mapToOffsetAndLimit } from '../../../pagination';
import { mapToFindOptions } from '../../helpers/mapToFindOptions';
import { InferAttributes, Op, WhereOptions } from 'sequelize';
import { UserDreal, Project } from '../../../../projectionsNext';
import { logger } from '../../../../../../core/utils';
import { isLocalEnv } from '../../../../../../config/env.config';

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

  const where: WhereOptions<InferAttributes<Project>> = {
    ...findOptions?.where,
    notifiedOn: { [Op.gt]: 0 },
    /**
     * Si l'environnement est local, on ne filtre pas par région
     */
    ...(!isLocalEnv && {
      regionProjet: {
        [Op.substring]: utilisateur.dreal,
      },
    }),
  };

  const résultat = await Project.findAndCountAll({
    where,
    ...mapToOffsetAndLimit(pagination),
    attributes,
  });

  const projetsAvecAppelOffre = résultat.rows.reduce((prev, current) => {
    const { appelOffreId, periodeId, familleId, ...projet } = current.get();
    const appelOffre = getProjectAppelOffre({
      appelOffreId,
      periodeId,
      familleId,
    });

    return [
      ...prev,
      {
        ...projet,
        ...(appelOffre && {
          appelOffre: {
            type: appelOffre.typeAppelOffre,
            unitePuissance: appelOffre.unitePuissance,
            periode: appelOffre.periode,
            changementProducteurPossibleAvantAchèvement:
              appelOffre.changementProducteurPossibleAvantAchèvement,
          },
        }),
      },
    ];
  }, []);

  return makePaginatedList(projetsAvecAppelOffre, résultat.count, pagination);
};
