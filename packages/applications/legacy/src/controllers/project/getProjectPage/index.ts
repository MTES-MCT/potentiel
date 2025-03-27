import * as yup from 'yup';
import { getProjectEvents } from '../../../config';
import { getProjectDataForProjectPage } from '../../../config/queries.config';
import { shouldUserAccessProject } from '../../../config/useCases.config';
import { Project } from '../../../infra/sequelize';
import { PermissionConsulterProjet } from '../../../modules/project';
import routes from '../../../routes';
import { ProjectDetailsPage } from '../../../views';
import { AlerteRaccordement } from '../../../views/pages/projectDetailsPage';
import {
  miseAJourStatistiquesUtilisation,
  notFoundResponse,
  unauthorizedResponse,
  vérifierPermissionUtilisateur,
} from '../../helpers';
import safeAsyncHandler from '../../helpers/safeAsyncHandler';
import { v1Router } from '../../v1Router';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { logger } from '../../../core/utils';
import { addQueryParams } from '../../../helpers/addQueryParams';

import {
  getAbandonStatut,
  getAlertesRaccordement,
  getAttestationDeConformité,
  getGarantiesFinancières,
  getReprésentantLégal,
  getRecours,
  getRaccordement,
  getActionnaire,
} from './_utils';
import { Role } from '@potentiel-domain/utilisateur';
import { getPuissance } from './_utils/getPuissance';

const schema = yup.object({
  params: yup.object({ projectId: yup.string().required() }),
});

export const estUnLegacyIdentifiantProjet = (value: string): value is IdentifiantProjet.RawType => {
  const [appelOffre, période, famille, numéroCRE] = value.split('#');

  return (
    typeof appelOffre === 'string' &&
    typeof numéroCRE === 'string' &&
    typeof période === 'string' &&
    typeof famille === 'string'
  );
};

const getLegacyIdentifiantProjet = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  const projetLegacy = await Project.findOne({
    where: {
      appelOffreId: identifiantProjetValueType.appelOffre,
      periodeId: identifiantProjetValueType.période,
      familleId: identifiantProjetValueType.famille ?? '',
      numeroCRE: identifiantProjetValueType.numéroCRE,
    },
    attributes: ['id'],
  });

  return projetLegacy?.id;
};

v1Router.get(
  routes.PROJECT_DETAILS(),
  vérifierPermissionUtilisateur(PermissionConsulterProjet),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) => {
        logger.warning(`Error in project details handler`, {
          errorName: error?.name,
          errorMessage: error?.message,
          errorStackTrace: error?.stack,
        });
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      },
    },
    async (request, response) => {
      const { user, query } = request;
      const role = Role.convertirEnValueType(user.role);

      const projectId = request.params.projectId;

      if (!projectId) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      if (estUnLegacyIdentifiantProjet(projectId)) {
        const legacyId = await getLegacyIdentifiantProjet(projectId);

        if (!legacyId) {
          return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
        }

        return response.redirect(addQueryParams(routes.PROJECT_DETAILS(legacyId), query));
      }

      const userHasRightsToProject = await shouldUserAccessProject.check({
        user,
        projectId,
      });

      if (!userHasRightsToProject) {
        return unauthorizedResponse({
          request,
          response,
          customMessage: `Votre compte ne vous permet pas d'accéder à ce projet.`,
        });
      }

      const rawProjet = await getProjectDataForProjectPage({ projectId, user });

      if (rawProjet.isErr()) {
        logger.warning(`Error in getProjectDataForProjectPage`, {
          errorName: rawProjet.error?.name,
          errorMessage: rawProjet.error?.message,
          errorStackTrace: rawProjet.error?.stack,
        });
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const project = rawProjet.value;

      const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(
        `${project.appelOffreId}#${project.periodeId}#${project.familleId}#${project.numeroCRE}`,
      );

      const rawProjectEventList = await getProjectEvents({ projectId: project.id, user });

      if (rawProjectEventList.isErr()) {
        logger.warning(`Error fetching project events`, {
          errorName: rawProjectEventList.error?.name,
          errorMessage: rawProjectEventList.error?.message,
          errorStackTrace: rawProjectEventList.error?.stack,
        });
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const abandon = await getAbandonStatut(identifiantProjetValueType);

      const raccordement = await getRaccordement({
        role,
        identifiantProjet: identifiantProjetValueType,
      });

      const alertesRaccordement: AlerteRaccordement[] | undefined = await getAlertesRaccordement({
        raccordement,
        role,
        identifiantProjet: identifiantProjetValueType,
        statutAbandon: abandon?.statut,
        CDC2022Choisi:
          project.cahierDesChargesActuel.type === 'modifié' &&
          project.cahierDesChargesActuel.paruLe === '30/08/2022',
      });
      const attestationConformité = await getAttestationDeConformité(
        identifiantProjetValueType,
        user.role,
      );

      miseAJourStatistiquesUtilisation({
        type: 'projetConsulté',
        données: {
          utilisateur: { role: user.role },
          projet: {
            appelOffreId: project.appelOffreId,
            periodeId: project.periodeId,
            ...(project.familleId && { familleId: project.familleId }),
            numéroCRE: project.numeroCRE,
          },
        },
      });

      const garantiesFinancières = await getGarantiesFinancières(
        identifiantProjetValueType,
        role,
        project.appelOffre.isSoumisAuxGF,
      );

      const aDesGarantiesFinancièresConstituées = !!garantiesFinancières?.actuelles;
      const aUnDépotEnCours = !!garantiesFinancières?.dépôtÀTraiter;

      const demandeNécessiteInstructionPourActionnaire =
        project.appelOffreId === 'Eolien' &&
        role.estÉgaleÀ(Role.porteur) &&
        (!aDesGarantiesFinancièresConstituées ||
          aUnDépotEnCours ||
          project.isFinancementParticipatif ||
          project.isInvestissementParticipatif);

      return response.send(
        ProjectDetailsPage({
          request,
          project,
          projectEventList: {
            ...rawProjectEventList.value,
            events: attestationConformité
              ? rawProjectEventList.value.events.concat(attestationConformité)
              : rawProjectEventList.value.events,
          },
          raccordement,
          alertesRaccordement,
          abandon,
          garantiesFinancières,
          représentantLégal: await getReprésentantLégal(identifiantProjetValueType, user.role),
          demandeRecours: await getRecours(identifiantProjetValueType),
          actionnaire: await getActionnaire({
            identifiantProjet: identifiantProjetValueType,
            rôle: user.role,
            demandeNécessiteInstruction: demandeNécessiteInstructionPourActionnaire,
          }),
          puissance: await getPuissance({
            identifiantProjet: identifiantProjetValueType,
            rôle: user.role,
          }),
          hasAttestationConformité: !!attestationConformité,
          modificationsNonPermisesParLeCDCActuel:
            project.cahierDesChargesActuel.type === 'initial' &&
            !!project.appelOffre.periode.choisirNouveauCahierDesCharges,
        }),
      );
    },
  ),
);
