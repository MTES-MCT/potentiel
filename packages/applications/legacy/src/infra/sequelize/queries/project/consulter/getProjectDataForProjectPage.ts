import { errAsync, okAsync, ResultAsync, wrapInfra } from '../../../../../core/utils';
import { getProjectAppelOffre } from '../../../../../config/queryProjectAO.config';
import {
  ProjectDataForProjectPage,
  GetProjectDataForProjectPage,
} from '../../../../../modules/project';
import { EntityNotFoundError } from '../../../../../modules/shared';
import { Project, File } from '../../../projectionsNext';
import { parseCahierDesChargesRéférence, ProjectAppelOffre, User } from '../../../../../entities';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { userIs, userIsNot } from '../../../../../modules/users';
import { Role } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/projet';

export const getProjectDataForProjectPage: GetProjectDataForProjectPage = ({ projectId, user }) => {
  const chargerProjet = wrapInfra(
    Project.findByPk(projectId, {
      include: [
        {
          model: File,
          as: 'certificateFile',
          attributes: ['id', 'filename'],
        },
      ],
    }),
  );

  const vérifierAccèsProjet = (
    project: Project | null,
  ): ResultAsync<Project, EntityNotFoundError> => {
    if (!project || (!project.notifiedOn && userIsNot(['admin', 'dgec-validateur', 'cre'])(user))) {
      return errAsync(new EntityNotFoundError());
    }

    return okAsync(project);
  };

  const récupérerAppelOffre = (
    project: Project,
  ): ResultAsync<{ project: any; appelOffre: ProjectAppelOffre }, EntityNotFoundError> => {
    const { appelOffreId, periodeId, familleId } = project;
    const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId });

    if (!appelOffre) {
      return errAsync(new EntityNotFoundError());
    }

    return okAsync({ project, appelOffre });
  };

  const récupérerCahierDesCharges = ({
    appelOffre,
    project,
  }: {
    project: Project;
    appelOffre: ProjectAppelOffre;
  }): ResultAsync<
    {
      appelOffre: ProjectAppelOffre;
      // TODO: retirer le any ici et résoudre les problèmes de typage pour cahierDesChargesActuel
      project: any;
      cahierDesCharges:
        | AppelOffre.Periode['cahierDesCharges']
        | { type: string; url: string; paruLe?: undefined; alternatif?: undefined }
        | {
            type: string;
            url: string | undefined;
            paruLe: '30/07/2021' | '30/08/2022' | '07/02/2023';
            alternatif: true | undefined;
          };
    },
    never
  > => {
    const { cahierDesChargesActuel: cahierDesChargesActuelRaw } = project;

    const cahierDesChargesActuel = parseCahierDesChargesRéférence(cahierDesChargesActuelRaw);

    const cahierDesCharges =
      cahierDesChargesActuel.type === 'initial'
        ? {
            type: 'initial',
            url: appelOffre.cahiersDesChargesUrl,
          }
        : {
            type: 'modifié',
            url: appelOffre.cahiersDesChargesUrl,
            paruLe: cahierDesChargesActuel.paruLe,
            alternatif: cahierDesChargesActuel.alternatif,
          };

    return okAsync({ appelOffre, project, cahierDesCharges });
  };

  return chargerProjet
    .andThen(vérifierAccèsProjet)
    .andThen(récupérerAppelOffre)
    .andThen(récupérerCahierDesCharges)
    .andThen(
      ({
        appelOffre,
        cahierDesCharges: cahierDesChargesActuel,
        project: {
          id,
          appelOffreId,
          periodeId,
          familleId,
          numeroCRE,
          puissance,
          prixReference,
          engagementFournitureDePuissanceAlaPointe,
          isFinancementParticipatif,
          isInvestissementParticipatif,
          actionnariat,
          adresseProjet,
          codePostalProjet,
          communeProjet,
          departementProjet,
          regionProjet,
          territoireProjet,
          nomProjet,
          nomCandidat,
          email,
          fournisseur,
          evaluationCarbone,
          note,
          details,
          notifiedOn,
          abandonedOn,
          certificateFile,
          classe,
          motifsElimination,
          users,
          completionDueOn,
          updatedAt,
          potentielIdentifier,
          dcrDueOn,
          désignationCatégorie,
          technologie,
        },
      }): ResultAsync<ProjectDataForProjectPage, never> =>
        okAsync({
          id,
          potentielIdentifier,
          appelOffreId,
          periodeId,
          familleId,
          appelOffre,
          numeroCRE,
          puissance,
          engagementFournitureDePuissanceAlaPointe,
          isFinancementParticipatif,
          isInvestissementParticipatif,
          actionnariat,
          adresseProjet,
          codePostalProjet,
          communeProjet,
          departementProjet,
          regionProjet,
          territoireProjet,
          nomProjet,
          nomCandidat,
          email,
          note,
          details,
          notifiedOn,
          completionDueOn,
          isClasse: classe === 'Classé',
          isAbandoned: abandonedOn !== 0,
          isLegacy: appelOffre.periode.type === 'legacy',
          motifsElimination,
          dcrDueOn,
          désignationCatégorie,
          updatedAt,
          unitePuissance: Candidature.UnitéPuissance.déterminer({
            appelOffres: appelOffre,
            période: periodeId,
            technologie: technologie ?? 'N/A',
          }).formatter(),
          cahierDesChargesActuel,
          ...(userIs([
            'admin',
            'porteur-projet',
            'dreal',
            'acheteur-obligé',
            'cocontractant',
            'ademe',
            'dgec-validateur',
            'cre',
          ])(user) && { fournisseur, evaluationCarbone }),
          ...(Role.convertirEnValueType(user.role).aLaPermission('projet.accèsDonnées.prix') && {
            prixReference,
          }),
          ...(userIs([
            'admin',
            'porteur-projet',
            'dreal',
            'acheteur-obligé',
            'cocontractant',
            'dgec-validateur',
            'cre',
          ])(user) && {
            ...(notifiedOn && { certificateFile }),
          }),
        }),
    )
    .andThen((dto) =>
      dto.appelOffre.typeAppelOffre === 'innovation'
        ? ajouterNotesInnovation({ dto, user })
        : okAsync(dto),
    );
};

const ajouterNotesInnovation = ({
  dto,
  user,
}: {
  dto: ProjectDataForProjectPage;
  user: User;
}): ResultAsync<ProjectDataForProjectPage, never> => {
  const formater = (note: string | null) => {
    if (note) {
      const noteParsée = parseFloat(note.replace(',', '.'));

      if (!Number.isNaN(noteParsée)) {
        return (Math.round(noteParsée * 100) / 100).toString();
      }
    }
    return 'N/A';
  };

  return userIs(['admin', 'dgec-validateur', 'ademe', 'cre', 'porteur-projet'])(user)
    ? okAsync({
        ...dto,
        notePrix: formater(dto.details['Note prix']),
        notesInnovation: {
          note: formater(dto.details['Note innovation\n(AO innovation)']),
          degréInnovation: formater(
            dto.details['Note degré d’innovation (/20pt)\n(AO innovation)'],
          ),
          positionnement: formater(
            dto.details['Note positionnement sur le marché (/10pt)\n(AO innovation)'],
          ),
          qualitéTechnique: formater(dto.details['Note qualité technique (/5pt)\n(AO innovation)']),
          adéquationAmbitionsIndustrielles: formater(
            dto.details[
              'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)'
            ],
          ),
          aspectsEnvironnementauxEtSociaux: formater(
            dto.details['Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)'],
          ),
        },
      })
    : okAsync(dto);
};
