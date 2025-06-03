import { getProjectAppelOffre } from '../../../../../../config/queryProjectAO.config';
import { ListerProjets } from '../../../../../../modules/project';
import { makePaginatedList, mapToOffsetAndLimit } from '../../../pagination';
import { mapToFindOptions } from '../../helpers/mapToFindOptions';
import { Op } from 'sequelize';
import { UserProjects, Project } from '../../../../projectionsNext';

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

  const projetsAvecAppelOffre = résultat.rows.reduce((prev, current) => {
    const projet = current.get();
    const appelOffre = getProjectAppelOffre({
      appelOffreId: projet.appelOffreId,
      periodeId: projet.periodeId,
      familleId: projet.familleId,
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
