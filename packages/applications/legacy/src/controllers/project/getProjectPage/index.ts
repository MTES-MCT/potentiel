import * as yup from 'yup';
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

import { StatutProjet } from '@potentiel-domain/common';
import { logger } from '../../../core/utils';
import { addQueryParams } from '../../../helpers/addQueryParams';

import {
  getAbandon,
  getAlertesRaccordement,
  getAttestationDeConformité,
  getGarantiesFinancières,
  getReprésentantLégal,
  getRecours,
  getRaccordement,
  getActionnaire,
  getCoefficientKChoisi,
} from './_utils';
import { Role } from '@potentiel-domain/utilisateur';
import { getPuissance } from './_utils/getPuissance';
import { getProducteur } from './_utils/getProducteur';
import { getFournisseur } from './_utils/getFournisseur';
import { getCandidature } from './_utils/getCandidature';
import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { mediator } from 'mediateur';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

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

      /**
       * Redirection vers la page de candidature si le projet non désigné et si l'utilisateur a la droit de consulter la candidature, page unauthorized sinon
       */
      if (!project.notifiedOn) {
        const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
          type: 'Candidature.Query.ConsulterCandidature',
          data: {
            identifiantProjet: identifiantProjetValueType.formatter(),
          },
        });

        if (Option.isSome(candidature)) {
          return response.redirect(
            Routes.Candidature.détails(identifiantProjetValueType.formatter()),
          );
        }

        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      /**
       * Redirection vers la page éliminé dans la nouvelle application
       */
      if (!project.isClasse) {
        return response.redirect(
          Routes.Projet.détailsÉliminé(identifiantProjetValueType.formatter()),
        );
      }

      const abandon = await getAbandon(identifiantProjetValueType);

      const raccordement = await getRaccordement({
        role,
        identifiantProjet: identifiantProjetValueType,
      });

      const statutProjet = !project.notifiedOn
        ? StatutProjet.nonNotifié
        : project.isAbandoned
          ? StatutProjet.abandonné
          : project.isClasse
            ? StatutProjet.classé
            : StatutProjet.éliminé;
      const alertesRaccordement: AlerteRaccordement[] | undefined = await getAlertesRaccordement({
        raccordement,
        role,
        identifiantProjet: identifiantProjetValueType,
        statutProjet,
        CDC2022Choisi:
          project.cahierDesChargesActuel.type === 'modifié' &&
          project.cahierDesChargesActuel.paruLe === '30/08/2022',
      });
      const achèvement = await getAttestationDeConformité(identifiantProjetValueType, user.role);

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

      const instructionChangementActionnaire =
        Lauréat.Actionnaire.InstructionChangementActionnaire.bind({
          appelOffre: project.appelOffreId,
          aDesGarantiesFinancièresConstituées: !!garantiesFinancières?.actuelles,
          aUnDépotEnCours: !!garantiesFinancières?.dépôtÀTraiter,
          typeActionnariat: project.isFinancementParticipatif
            ? Candidature.TypeActionnariat.financementParticipatif
            : project.isInvestissementParticipatif
              ? Candidature.TypeActionnariat.investissementParticipatif
              : undefined,
        });

      const demandeNécessiteInstructionPourActionnaire =
        role.estÉgaleÀ(Role.porteur) && instructionChangementActionnaire.estRequise();

      const recours = await getRecours(identifiantProjetValueType);

      return response.send(
        ProjectDetailsPage({
          request,
          project,
          raccordement: mapToPlainObject(raccordement),
          alertesRaccordement,
          abandon: abandon && mapToPlainObject(abandon),
          garantiesFinancières,
          représentantLégal: await getReprésentantLégal({
            identifiantProjet: identifiantProjetValueType,
            rôle: user.role,
          }),
          demandeRecours: recours && mapToPlainObject(recours),
          actionnaire: await getActionnaire({
            identifiantProjet: identifiantProjetValueType,
            rôle: user.role,
            demandeNécessiteInstruction: demandeNécessiteInstructionPourActionnaire,
          }),
          puissance: await getPuissance({
            identifiantProjet: identifiantProjetValueType,
            rôle: user.role,
          }),
          producteur: await getProducteur({
            identifiantProjet: identifiantProjetValueType,
            rôle: user.role,
            changementProducteurPossibleAvantAchèvement:
              project.appelOffre.changementProducteurPossibleAvantAchèvement,
          }),
          candidature: await getCandidature({ identifiantProjet: identifiantProjetValueType }),
          estAchevé: !!achèvement,
          achèvement,
          modificationsNonPermisesParLeCDCActuel:
            project.cahierDesChargesActuel.type === 'initial' &&
            !!project.appelOffre.periode.choisirNouveauCahierDesCharges,
          coefficientKChoisi: await getCoefficientKChoisi(
            identifiantProjetValueType,
            project.appelOffre.periode,
          ),
          fournisseur: await getFournisseur({
            identifiantProjet: identifiantProjetValueType,
            rôle: user.role,
          }),
        }),
      );
    },
  ),
);
