import { getProjectAppelOffre } from '../../../../../../../config/queryProjectAO.config';
import { Project } from '../../../../../projectionsNext/project/project.model';

export const getProjetsAvecAppelOffre = (projets: Project[]) => {
  if (!projets.length) {
    return [];
  }

  return projets.map((instanceProjet: Project) => {
    const projet = instanceProjet.get();

    const appelOffre = getProjectAppelOffre({
      appelOffreId: projet.appelOffreId,
      periodeId: projet.periodeId,
      familleId: projet.familleId,
    });

    return {
      ...projet,
      ...(appelOffre
        ? {
            appelOffre: {
              type: appelOffre.typeAppelOffre,
              unitePuissance: appelOffre.unitePuissance,
              periode: appelOffre.periode,
              changementProducteurPossibleAvantAchèvement:
                appelOffre.changementProducteurPossibleAvantAchèvement,
            },
          }
        : {}),
    };
  });
};
