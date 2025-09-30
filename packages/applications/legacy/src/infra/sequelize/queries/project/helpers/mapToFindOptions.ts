import { FiltreListeProjets } from '../../../../../modules/project/queries';
import { Op, literal } from 'sequelize';

export const mapToFindOptions = ({
  recherche,
  appelOffre,
  classement,
  reclames,
}: FiltreListeProjets) => {
  const filtreRecherche = recherche ? construireFiltreRecherche(recherche) : undefined;
  const filtreAO = appelOffre && construireFiltreAppelOffre(appelOffre);
  const filtreClassement = classement && construireFiltreClassement(classement);
  const filtreReclames = reclames && construireFiltreRéclamé(reclames);

  return {
    where: {
      ...filtreRecherche?.where,
      ...filtreAO?.where,
      ...filtreClassement?.where,
      ...filtreReclames?.where,
    },
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
    ...(classement === 'actif' && { classe: 'Classé', abandonedOn: 0 }),
    ...(classement === 'abandonné' && { classe: 'Classé', abandonedOn: { [Op.ne]: 0 } }),
    ...(classement === 'éliminé' && { classe: 'Eliminé', abandonedOn: 0 }),
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
