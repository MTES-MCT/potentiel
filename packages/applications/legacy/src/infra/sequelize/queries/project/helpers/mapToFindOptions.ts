import { FiltreListeProjets } from '../../../../../modules/project/queries';
import { Op, literal } from 'sequelize';

export const mapToFindOptions = (filtres?: FiltreListeProjets) => {
  if (!filtres) {
    return undefined;
  }

  const { recherche, appelOffre, classement, reclames } = filtres;

  const filtreRecherche = construireFiltreRecherche(recherche);
  const filtreAO = construireFiltreAppelOffre(appelOffre);
  const filtreClassement = construireFiltreClassement(classement);
  const filtreReclames = construireFiltreRéclamé(reclames);

  return {
    where: {
      ...filtreRecherche?.where,
      ...filtreAO?.where,
      ...filtreClassement?.where,
      ...filtreReclames?.where,
    },
  };
};

const construireFiltreRecherche = (recherche?: string) =>
  recherche
    ? {
        where: { nomProjet: { [Op.iLike]: `%${recherche}%` } },
      }
    : undefined;

const construireFiltreAppelOffre = (appelOffre: FiltreListeProjets['appelOffre']) =>
  appelOffre
    ? {
        where: {
          ...(appelOffre.appelOffreId && { appelOffreId: appelOffre.appelOffreId }),
          ...(appelOffre.periodeId && { periodeId: appelOffre.periodeId }),
          ...(appelOffre.familleId && { familleId: appelOffre.familleId }),
        },
      }
    : undefined;

const construireFiltreClassement = (classement: FiltreListeProjets['classement']) =>
  classement
    ? {
        where: {
          ...(classement === 'actif' && { classe: 'Classé', abandonedOn: 0 }),
          ...(classement === 'abandonné' && { classe: 'Classé', abandonedOn: { [Op.ne]: 0 } }),
          ...(classement === 'éliminé' && { classe: 'Eliminé', abandonedOn: 0 }),
        },
      }
    : undefined;

const construireFiltreRéclamé = (reclames: FiltreListeProjets['reclames']) =>
  reclames
    ? {
        where: {
          ...(reclames === 'réclamés' && {
            id: { [Op.in]: literal(`(SELECT "projectId" FROM "UserProjects")`) },
          }),
          ...(reclames === 'non-réclamés' && {
            id: { [Op.notIn]: literal(`(SELECT "projectId" FROM "UserProjects")`) },
          }),
        },
      }
    : undefined;
