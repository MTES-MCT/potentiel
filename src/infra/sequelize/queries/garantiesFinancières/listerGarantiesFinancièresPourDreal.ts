import { getProjectAppelOffre } from '../../../../config/queryProjectAO.config';
import {
  GarantiesFinancièresListItem,
  ListerGarantiesFinancièresPourDreal,
} from '../../../../modules/garantiesFinancières';
import { makePaginatedList, mapToOffsetAndLimit } from '../pagination';
import { mapToFindOptions } from '../project/helpers/mapToFindOptions';
import { Op } from 'sequelize';
import { UserDreal, Project } from '../../projectionsNext';
import { logger } from '../../../../core/utils';
import { getProjectGarantiesFinancièresData } from './getProjectGarantiesFinancièresData';

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
  'classe',
  'abandonedOn',
  'notifiedOn',
  'numeroCRE',
];

export const listerGarantiesFinancièresPourDreal: ListerGarantiesFinancièresPourDreal = async ({
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

  const projets = await Project.findAndCountAll({
    where: {
      ...findOptions?.where,
      notifiedOn: { [Op.gt]: 0 },
      regionProjet: {
        [Op.substring]: utilisateur.dreal,
      },
      soumisAuxGF: true,
    },
    ...mapToOffsetAndLimit(pagination),
    attributes,
    order: [
      ['notifiedOn', 'DESC'],
      ['nomProjet', 'ASC'],
    ],
  });

  let projetsAvecGarantiesFinancières: GarantiesFinancièresListItem[] = [];

  await Promise.all(
    projets.rows.map(async (rawProjet) => {
      const projet = rawProjet.get();
      const { appelOffreId, periodeId, familleId } = projet;

      const appelOffre = getProjectAppelOffre({
        appelOffreId,
        periodeId,
        familleId,
      });

      if (!appelOffre || !appelOffre?.isSoumisAuxGF) {
        return;
      }

      const garantiesFinancières = await getProjectGarantiesFinancièresData({
        identifiantProjet: {
          appelOffre: appelOffreId,
          période: periodeId,
          famille: familleId,
          numéroCRE: projet.numeroCRE,
        },
        garantiesFinancièresSoumisesÀLaCandidature:
          appelOffre.famille?.soumisAuxGarantiesFinancieres === 'à la candidature'
            ? true
            : appelOffre.soumisAuxGarantiesFinancieres === 'à la candidature'
            ? true
            : false,
      });

      if (garantiesFinancières) {
        projetsAvecGarantiesFinancières.push({
          ...projet,
          garantiesFinancières,
          appelOffre: {
            title: projet.appelOffreId,
            periode: projet.periodeId,
            famille: projet.familleId,
          },
        });
      }
    }),
  );

  projetsAvecGarantiesFinancières.sort((a, b) => {
    if (a.notifiedOn !== b.notifiedOn) {
      return b.notifiedOn - a.notifiedOn;
    }
    return a.nomProjet.localeCompare(b.nomProjet, 'fr', { ignorePunctuation: true });
  });

  return makePaginatedList(projetsAvecGarantiesFinancières, projets.count, pagination);
};
