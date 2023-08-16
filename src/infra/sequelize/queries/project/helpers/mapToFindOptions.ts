import { GarantiesFinancières } from '../../../projectionsNext';
import { FiltreListeProjets } from '../../../../../modules/project/queries';
import { Op, literal } from 'sequelize';

export const mapToFindOptions = ({
  recherche,
  appelOffre,
  classement,
  reclames,
  garantiesFinancieres,
}: FiltreListeProjets) => {
  const filtreRecherche = recherche ? construireFiltreRecherche(recherche) : undefined;
  const filtreAO = appelOffre && construireFiltreAppelOffre(appelOffre);
  const filtreClassement = classement && construireFiltreClassement(classement);
  const filtreReclames = reclames && construireFiltreRéclamé(reclames);
  const filtreGarantiesFinancieres =
    garantiesFinancieres && construireFiltreGarantiesFinancières(garantiesFinancieres);

  return {
    where: {
      ...filtreRecherche?.where,
      ...filtreAO?.where,
      ...filtreClassement?.where,
      ...filtreReclames?.where,
      ...filtreGarantiesFinancieres?.where,
    },
    include: [...(filtreGarantiesFinancieres?.include ? filtreGarantiesFinancieres.include : [])],
  };
};

const construireFiltreRecherche = (termes: string) => ({
  where: { nomProjet: { [Op.iLike]: `%${termes}%` } },
});

const construireFiltreAppelOffre = ({
  appelOffreId,
  periodeId,
  familleId,
}: NonNullable<FiltreListeProjets['appelOffre']>) => ({
  where: {
    ...(appelOffreId && { appelOffreId }),
    ...(periodeId && { periodeId }),
    ...(familleId && { familleId }),
  },
});

const construireFiltreClassement = (classement: NonNullable<FiltreListeProjets['classement']>) => ({
  where: {
    ...(classement === 'classés' && { classe: 'Classé', abandonedOn: 0 }),
    ...(classement === 'éliminés' && { classe: 'Eliminé', abandonedOn: 0 }),
    ...(classement === 'abandons' && { abandonedOn: { [Op.ne]: 0 } }),
  },
});

const construireFiltreRéclamé = (reclames: NonNullable<FiltreListeProjets['reclames']>) => ({
  where: {
    ...(reclames === 'réclamés' && {
      id: { [Op.in]: literal(`(SELECT "projectId" FROM "UserProjects")`) },
    }),
    ...(reclames === 'non-réclamés' && {
      id: { [Op.notIn]: literal(`(SELECT "projectId" FROM "UserProjects")`) },
    }),
  },
});

const construireFiltreGarantiesFinancières = (
  garantiesFinancières: NonNullable<FiltreListeProjets['garantiesFinancieres']>,
) => ({
  where: {
    ...(garantiesFinancières === 'submitted' && {
      '$garantiesFinancières.dateEnvoi$': { [Op.ne]: null },
    }),
    ...(garantiesFinancières === 'notSubmitted' && {
      '$garantiesFinancières.dateLimiteEnvoi$': { [Op.ne]: null },
      '$garantiesFinancières.dateEnvoi$': null,
    }),
    ...(garantiesFinancières === 'pastDue' && {
      '$garantiesFinancières.dateLimiteEnvoi$': {
        [Op.lte]: new Date(),
        [Op.ne]: null,
      },
      '$garantiesFinancières.dateEnvoi$': null,
    }),
  },
  include: [
    {
      model: GarantiesFinancières,
      as: 'garantiesFinancières',
    },
  ],
});
