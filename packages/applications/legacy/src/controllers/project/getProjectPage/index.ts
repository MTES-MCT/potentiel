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
import { getLogger } from '@potentiel-libraries/monitoring';
import { addQueryParams } from '../../../helpers/addQueryParams';

import {
  getAbandonStatut,
  getAlertesRaccordement,
  getAttestationDeConformité,
  getGarantiesFinancières,
  getNomReprésentantLégal,
  getRecours,
} from './_utils';

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

      const projet = rawProjet.value;

      const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(
        `${projet.appelOffreId}#${projet.periodeId}#${projet.familleId}#${projet.numeroCRE}`,
      );
      const abandon = await getAbandonStatut(identifiantProjetValueType);

      let alertesRaccordement: AlerteRaccordement[] | undefined = undefined;
      try {
        alertesRaccordement =
          !abandon || abandon.statut === 'rejeté'
            ? await getAlertesRaccordement({
                userRole: user.role,
                identifiantProjet: identifiantProjetValueType,
                CDC2022Choisi:
                  projet.cahierDesChargesActuel.type === 'modifié' &&
                  projet.cahierDesChargesActuel.paruLe === '30/08/2022',
                projet: {
                  isClasse: projet.isClasse,
                  isAbandonned: projet.isAbandoned,
                },
              })
            : undefined;
      } catch (error) {
        getLogger().warn(`An error occurred when getting raccordements alerts`, {
          error,
          identifiantProjetValueType,
        });
      }

      const rawProjectEventList = await getProjectEvents({ projectId: projet.id, user });

      if (rawProjectEventList.isErr()) {
        logger.warning(`Error fetching project events`, {
          errorName: rawProjectEventList.error?.name,
          errorMessage: rawProjectEventList.error?.message,
          errorStackTrace: rawProjectEventList.error?.stack,
        });
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      miseAJourStatistiquesUtilisation({
        type: 'projetConsulté',
        données: {
          utilisateur: { role: request.user.role },
          projet: {
            appelOffreId: projet.appelOffreId,
            periodeId: projet.periodeId,
            ...(projet.familleId && { familleId: projet.familleId }),
            numéroCRE: projet.numeroCRE,
          },
        },
      });

      const garantiesFinancières = await getGarantiesFinancières(
        identifiantProjetValueType,
        projet.appelOffre.isSoumisAuxGF,
      );

      const attestationConformité = await getAttestationDeConformité(
        identifiantProjetValueType,
        user,
      );

      const nomReprésentantLégal = await getNomReprésentantLégal(identifiantProjetValueType);

      return response.send(
        ProjectDetailsPage({
          request,
          project: {
            ...projet,
            garantiesFinancières,
          },
          projectEventList: {
            ...rawProjectEventList.value,
            events: attestationConformité
              ? rawProjectEventList.value.events.concat(attestationConformité)
              : rawProjectEventList.value.events,
          },
          alertesRaccordement,
          abandon,
          nomReprésentantLégal,
          demandeRecours: await getRecours(identifiantProjetValueType),
          hasAttestationConformité: !!attestationConformité,
        }),
      );
    },
  ),
);