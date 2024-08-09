import { ImportExecuted, ProjectRawDataImported } from '../events';
import { IllegalProjectDataError } from '../errors';
import { parseProjectModifications } from '../utils';
import { AppelOffreRepo } from '../../../dataAccess';
import { User } from '../../../entities';
import { parseProjectLine } from '../utils/parseProjectLine';
import { LegacyModificationRawDataImported } from '../../modificationRequest';
import { EventBus } from '../../../core/domain';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DésignationCatégorie } from '../types';

interface ImportProjectsDeps {
  eventBus: EventBus;
  appelOffreRepo: AppelOffreRepo;
}

interface ImportProjectsArgs {
  lines: Record<string, string>[];
  importId: string;
  importedBy: User;
}

export type ProjectData = ReturnType<typeof parseProjectLine> & {
  désignationCatégorie?: DésignationCatégorie;
};

export const makeImportProjects =
  ({ eventBus, appelOffreRepo }: ImportProjectsDeps) =>
  async ({ lines, importId, importedBy }: ImportProjectsArgs): Promise<void> => {
    const errors: Record<number, string> = {};
    const projects: {
      projectData: ProjectData;
      legacyModifications: ReturnType<typeof parseProjectModifications>;
    }[] = [];

    const appelsOffre = await appelOffreRepo.findAll();

    for (const [i, line] of lines.entries()) {
      try {
        const projectData = parseProjectLine(line);

        const projectAppelOffre = appelsOffre.find(
          (appelOffre) => appelOffre.id === projectData.appelOffreId,
        );

        if (!projectAppelOffre) {
          throw new Error(`Appel d’offre inconnu: ${projectData.appelOffreId}`);
        }

        const periodeDetails = projectAppelOffre.periodes.find(
          (periode) => periode.id === projectData.periodeId,
        );

        if (!periodeDetails) {
          throw new Error(`Période inconnue`);
        }

        const { isLegacyProject } = checkFamille(projectData, projectAppelOffre, periodeDetails);

        checkGarantiesFinancières(projectData, projectAppelOffre);

        const legacyModifications = parseProjectModifications(line);

        const hasLegacyModifications = !!legacyModifications.length;
        checkLegacyRules({ projectData, isLegacyProject, hasLegacyModifications });

        const désignationCatégorie = getDésignationCatégorie({ projectData, periodeDetails });

        projects.push({
          projectData: { ...projectData, ...(désignationCatégorie && { désignationCatégorie }) },
          legacyModifications,
        });
      } catch (e) {
        errors[i + 1] = e.message;
        if (Object.keys(errors).length > 100) {
          break;
        }
      }
    }

    if (Object.keys(errors).length) {
      throw new IllegalProjectDataError(errors);
    }

    await eventBus.publish(
      new ImportExecuted({ payload: { importId, importedBy: importedBy.id } }),
    );

    for (const { projectData, legacyModifications } of projects) {
      await eventBus.publish(
        new ProjectRawDataImported({
          payload: {
            importId,
            data: projectData,
          },
        }),
      );

      const { appelOffreId, periodeId, familleId, numeroCRE } = projectData;

      if (legacyModifications.length) {
        await eventBus.publish(
          new LegacyModificationRawDataImported({
            payload: {
              appelOffreId,
              periodeId,
              familleId,
              numeroCRE,
              importId,
              modifications: legacyModifications,
            },
          }),
        );
      }
    }
  };

const checkFamille = (
  projectData: ReturnType<typeof parseProjectLine>,
  projectAppelOffre: AppelOffre.AppelOffreReadModel,
  periodeDetails: AppelOffre.Periode,
) => {
  const { appelOffreId, familleId } = projectData;
  if (familleId) {
    if (!periodeDetails.familles.length) {
      throw new Error(
        `L'appel d'offre ${appelOffreId} n'a pas de familles, mais la ligne en comporte une: ${familleId}`,
      );
    }

    const famille = periodeDetails.familles.find((famille) => famille.id === familleId);
    if (!famille) {
      throw new Error(`La famille ${familleId} n’existe pas dans l'appel d'offre ${appelOffreId}`);
    }
  } else {
    if (periodeDetails.familles.length) {
      throw new Error(
        `L'appel d'offre ${appelOffreId} requiert une famille et aucune n'est présente`,
      );
    }
  }
  return { isLegacyProject: periodeDetails.type === 'legacy' };
};

const checkGarantiesFinancières = (
  projectData: ReturnType<typeof parseProjectLine>,
  projectAppelOffre: AppelOffre.AppelOffreReadModel,
) => {
  const familleDetails = projectAppelOffre.periodes
    .find((p) => p.id === projectData.periodeId)
    ?.familles.find((f) => f.id === projectData.familleId);

  const isSoumisAuxGFÀLaCandidature = familleDetails
    ? familleDetails.soumisAuxGarantiesFinancieres === 'à la candidature'
    : projectAppelOffre.soumisAuxGarantiesFinancieres === 'à la candidature';
  if (
    isSoumisAuxGFÀLaCandidature &&
    projectData.classe === 'Classé' &&
    !projectData.garantiesFinancièresType
  ) {
    throw new Error(`Vous devez renseigner le type de garanties financières.`);
  }
};

const checkLegacyRules = (args: {
  projectData;
  isLegacyProject: boolean;
  hasLegacyModifications: boolean;
}) => {
  const { projectData, isLegacyProject, hasLegacyModifications } = args;
  const { appelOffreId, periodeId } = projectData;

  if (isLegacyProject) {
    if (!projectData.notifiedOn) {
      throw new Error(
        `La période ${appelOffreId}-${periodeId} est historique (non notifiée sur Potentiel) et requiert donc une date de notification`,
      );
    }
  } else {
    if (projectData.notifiedOn) {
      throw new Error(
        `La période ${appelOffreId}-${periodeId} est notifiée sur Potentiel. Le projet concerné ne doit pas comporter de date de notification.`,
      );
    }

    if (hasLegacyModifications) {
      throw new Error(
        `La période ${appelOffreId}-${periodeId} est notifiée sur Potentiel. Le projet concerné ne doit pas comporter de modifications.`,
      );
    }
  }
};

const getDésignationCatégorie = ({
  projectData,
  periodeDetails,
}: {
  projectData: ProjectData;
  periodeDetails: AppelOffre.Periode;
}): DésignationCatégorie | undefined => {
  if (periodeDetails.noteThresholdBy !== 'category') {
    return;
  }

  return projectData.puissance <= periodeDetails.noteThreshold.volumeReserve.puissanceMax &&
    projectData.note >= periodeDetails.noteThreshold.volumeReserve.noteThreshold
    ? 'volume-réservé'
    : 'hors-volume-réservé';
};
