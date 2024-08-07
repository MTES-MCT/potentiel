import { getProjectAppelOffre } from '../../../../../../config/queryProjectAO.config';
import { ListerProjets } from '../../../../../../modules/project/queries';
import { Project } from '../../../../projectionsNext';
import { makePaginatedList, mapToOffsetAndLimit } from '../../../pagination';
import { mapToFindOptions } from '../../helpers/mapToFindOptions';

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
  'evaluationCarbone',
  'classe',
  'abandonedOn',
  'notifiedOn',
  'isFinancementParticipatif',
  'isInvestissementParticipatif',
  'actionnariat',
];

export const listerProjetsAccèsComplet: ListerProjets = async ({ pagination, filtres }) => {
  const findOptions = filtres && mapToFindOptions(filtres);

  const résultat = await Project.findAndCountAll({
    where: {
      ...findOptions?.where,
    },
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
