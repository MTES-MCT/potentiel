import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getProjectAppelOffre } from '../../../../../../config/queryProjectAO.config';
import { ListerProjets } from '../../../../../../modules/project/queries';
import { Project } from '../../../../projectionsNext';
import { makePaginatedList, mapToOffsetAndLimit } from '../../../pagination';
import { mapToFindOptions } from '../../helpers/mapToFindOptions';
import { Op } from 'sequelize';

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

export const listerProjetsPourAcheteurObligé: ListerProjets = async ({ pagination, filtres }) => {
  const findOptions = filtres && mapToFindOptions(filtres);

  const résultat = await Project.findAndCountAll({
    where: {
      ...findOptions?.where,
      notifiedOn: { [Op.gt]: 0 },
    },
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
        identifiantProjet: IdentifiantProjet.convertirEnValueType(
          `${projet.appelOffreId}#${projet.periodeId}#${projet.familleId}#${projet.numeroCRE}`,
        ).formatter(),
      },
    ];
  }, []);

  return makePaginatedList(projetsAvecAppelOffre, résultat.count, pagination);
};
