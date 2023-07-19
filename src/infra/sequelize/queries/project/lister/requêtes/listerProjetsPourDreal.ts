import { getProjectAppelOffre } from '@config/queryProjectAO.config';
import { ListerProjets } from '@modules/project';
import { makePaginatedList, mapToOffsetAndLimit } from '../../../pagination';
import { mapToFindOptions } from '../../helpers/mapToFindOptions';
import { GarantiesFinancières } from '../../../../projectionsNext/garantiesFinancières/garantiesFinancières.model';
import { Op } from 'sequelize';
import { UserDreal, Project, File } from '@infra/sequelize/projectionsNext';
import { logger } from '@core/utils';

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
    include: [
      ...(findOptions?.include ? findOptions.include : []),
      {
        model: GarantiesFinancières,
        as: 'garantiesFinancières',
        include: [{ model: File, as: 'fichier' }],
      },
    ],
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
            type: appelOffre.type,
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
