import { FiltreListeProjets } from '../../../../../modules/project/queries';
import { Op, literal } from 'sequelize';

export const mapToFindOptions = (filtres?: FiltreListeProjets) => {
  if (!filtres) {
    return undefined;
  }

  const { recherche, appelOffre, classement } = filtres;

  const filtreRecherche = construireFiltreRecherche(recherche);
  const filtreAO = construireFiltreAppelOffre(appelOffre);
  const filtreClassement = construireFiltreClassement(classement);
  const filtreRégion = construireFiltreRégions(filtres.régions);
  const filtreProjet = construireFiltreProjets(filtres.projets);

  return {
    where: {
      ...filtreRecherche,
      ...filtreAO,
      ...filtreClassement,
      ...filtreRégion,
      ...filtreProjet,
    },
  };
};

const construireFiltreRecherche = (recherche?: string) =>
  recherche
    ? {
        nomProjet: { [Op.iLike]: `%${recherche}%` },
      }
    : undefined;

const construireFiltreAppelOffre = (appelOffre: FiltreListeProjets['appelOffre']) =>
  appelOffre
    ? {
        ...(appelOffre.appelOffreId && { appelOffreId: appelOffre.appelOffreId }),
        ...(appelOffre.periodeId && { periodeId: appelOffre.periodeId }),
        ...(appelOffre.familleId && { familleId: appelOffre.familleId }),
      }
    : undefined;

const construireFiltreClassement = (classement: FiltreListeProjets['classement']) =>
  classement
    ? {
        ...(classement === 'classé' && { classe: 'Classé' }),
        ...(classement === 'actif' && { classe: 'Classé', abandonedOn: 0 }),
        ...(classement === 'abandonné' && { classe: 'Classé', abandonedOn: { [Op.ne]: 0 } }),
        ...(classement === 'éliminé' && { classe: 'Eliminé', abandonedOn: 0 }),
      }
    : undefined;

const construireFiltreRégions = (régions?: Array<string>) =>
  !régions
    ? undefined
    : régions.length === 1
      ? {
          regionProjet: régions[0],
        }
      : {
          regionProjet: { [Op.in]: régions },
        };

const construireFiltreProjets = (projets?: Array<string>) =>
  !projets
    ? undefined
    : projets.length === 1
      ? {
          id: projets[0],
        }
      : {
          id: { [Op.in]: projets },
        };
