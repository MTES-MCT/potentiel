import * as yup from 'yup';
import { getProjectDataForProjectPage } from '../../../config/queries.config';
import { shouldUserAccessProject } from '../../../config/useCases.config';
import { Project } from '../../../infra/sequelize';
import { PermissionConsulterProjet } from '../../../modules/project';
import routes from '../../../routes';
import { ProjectDetailsPage } from '../../../views';
import {
  miseAJourStatistiquesUtilisation,
  notFoundResponse,
  unauthorizedResponse,
  vérifierPermissionUtilisateur,
} from '../../helpers';
import safeAsyncHandler from '../../helpers/safeAsyncHandler';
import { v1Router } from '../../v1Router';

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
  getDateAchèvementPrévisionnel,
  getInstallationAvecDispositifDeStockage,
} from './_utils';
import { Role } from '@potentiel-domain/utilisateur';
import { getPuissance } from './_utils/getPuissance';
import { getProducteur } from './_utils/getProducteur';
import { getFournisseur } from './_utils/getFournisseur';
import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { mediator } from 'mediateur';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { getDélai } from './_utils/getDélai';
import { getInstallateur } from './_utils/getInstallateur';

const schema = yup.object({
  params: yup.object({ projectId: yup.string().required() }),
});

export const estUnIdentifiantProjet = (value: string): value is IdentifiantProjet.RawType => {
  const [appelOffre, période, famille, numéroCRE] = decodeURIComponent(value).split('#');

  return (
    typeof appelOffre === 'string' &&
    typeof numéroCRE === 'string' &&
    typeof période === 'string' &&
    typeof famille === 'string'
  );
};

const getIdentifiantProjet = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(
    decodeURIComponent(identifiantProjet),
  );
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

      if (estUnIdentifiantProjet(projectId)) {
        const legacyId = await getIdentifiantProjet(projectId);

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
       * Redirection vers la page de candidature si le projet n'est pas désigné
       */
      if (!project.notifiedOn) {
        if (role.aLaPermission('candidature.consulter')) {
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

      const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
        type: 'Lauréat.Query.ConsulterLauréat',
        data: { identifiantProjet: identifiantProjetValueType.formatter() },
      });

      const cahierDesCharges = await mediator.send<Lauréat.ConsulterCahierDesChargesQuery>({
        type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
        data: {
          identifiantProjetValue: identifiantProjetValueType.formatter(),
        },
      });

      if (Option.isNone(lauréat) || Option.isNone(cahierDesCharges)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const abandon = await getAbandon(identifiantProjetValueType);

      const raccordement = await getRaccordement({
        role,
        identifiantProjet: identifiantProjetValueType,
      });

      const alertesRaccordement =
        project.notifiedOn && project.isClasse && !project.isAbandoned && role.estPorteur()
          ? await getAlertesRaccordement({
              raccordement: raccordement.raccordement,
              identifiantProjet: identifiantProjetValueType,
              CDC2022Choisi:
                project.cahierDesChargesActuel.type === 'modifié' &&
                project.cahierDesChargesActuel.paruLe === '30/08/2022',
            })
          : [];

      const attestationConformité = await getAttestationDeConformité(
        identifiantProjetValueType,
        user.role,
      );

      const dateAchèvementPrévisionnel = await getDateAchèvementPrévisionnel(
        identifiantProjetValueType,
      );
      if (Option.isNone(dateAchèvementPrévisionnel)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

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
        cahierDesCharges.estSoumisAuxGarantiesFinancières(),
      );

      const instructionChangementActionnaire =
        Lauréat.Actionnaire.InstructionChangementActionnaire.bind({
          aDesGarantiesFinancièresConstituées: !!garantiesFinancières?.actuelles,
          aUnDépotEnCours: !!garantiesFinancières?.dépôtÀTraiter,
          typeActionnariat: project.isFinancementParticipatif
            ? Candidature.TypeActionnariat.financementParticipatif
            : project.isInvestissementParticipatif
              ? Candidature.TypeActionnariat.investissementParticipatif
              : undefined,
        });

      const demandeNécessiteInstructionPourActionnaire = !!(
        role.estÉgaleÀ(Role.porteur) &&
        cahierDesCharges.getRèglesChangements('actionnaire').demande &&
        instructionChangementActionnaire.estRequise()
      );

      const recours = await getRecours(identifiantProjetValueType);
      const délai = await getDélai({
        identifiantProjet: identifiantProjetValueType,
        identifiantUtilisateur: user.email,
        rôle: user.role,
      });

      const installationAvecDispositifDeStockage = await getInstallationAvecDispositifDeStockage({
        identifiantProjet: identifiantProjetValueType,
        rôle: user.role,
      });

      return response.send(
        ProjectDetailsPage({
          request,
          project,
          raccordement,
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
            règlesChangementPourAppelOffres: cahierDesCharges.getRèglesChangements('actionnaire'),
          }),
          puissance: await getPuissance({
            identifiantProjet: identifiantProjetValueType,
            rôle: user.role,
          }),
          producteur: await getProducteur({
            identifiantProjet: identifiantProjetValueType,
            rôle: user.role,
            changementProducteurPossibleAvantAchèvement:
              cahierDesCharges.appelOffre.changementProducteurPossibleAvantAchèvement,
          }),
          emailContact: lauréat.emailContact.formatter(),
          estAchevé: !!attestationConformité,
          attestationConformité,
          dateAchèvementPrévisionnel,
          modificationsNonPermisesParLeCDCActuel:
            cahierDesCharges.doitChoisirUnCahierDesChargesModificatif(),
          coefficientKChoisi: lauréat.coefficientKChoisi,
          fournisseur: await getFournisseur({
            identifiantProjet: identifiantProjetValueType,
            rôle: user.role,
            règlesChangementPourAppelOffres: cahierDesCharges.getRèglesChangements('fournisseur'),
          }),
          délai,
          autorisationDUrbanisme: lauréat.autorisationDUrbanisme,
          installateur: await getInstallateur({
            identifiantProjet: identifiantProjetValueType,
            rôle: user.role,
          }),
          installationAvecDispositifDeStockage,
        }),
      );
    },
  ),
);
