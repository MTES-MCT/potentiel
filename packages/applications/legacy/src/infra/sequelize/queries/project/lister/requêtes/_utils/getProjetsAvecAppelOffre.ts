import { Candidature } from '@potentiel-domain/projet';
import { getProjectAppelOffre } from '../../../../../../../config/queryProjectAO.config';
import { Project } from '../../../../../projectionsNext/project/project.model';
import { ProjectListItem } from '../../../../../../../modules/project';

export const getProjetsAvecAppelOffre = (projets: Project[]): ProjectListItem[] => {
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
              periode: appelOffre.periode,
              changementProducteurPossibleAvantAchèvement:
                appelOffre.changementProducteurPossibleAvantAchèvement,
            },
            unitéPuissance: Candidature.UnitéPuissance.déterminer({
              appelOffres: appelOffre,
              période: projet.periodeId,
              technologie: projet.technologie ?? 'N/A',
            }).formatter(),
          }
        : {
            unitéPuissance: 'N/A' as const,
          }),
    };
  });
};
