import { getProjectEvents } from '../../config';
import { getProjectDataForProjectPage } from '../../config/queries.config';
import { shouldUserAccessProject } from '../../config/useCases.config';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import { ProjectDetailsPage } from '../../views';
import {
  notFoundResponse,
  unauthorizedResponse,
  miseAJourStatistiquesUtilisation,
  vérifierPermissionUtilisateur,
} from '../helpers';
import routes from '../../routes';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { PermissionConsulterProjet } from '../../modules/project';
import { mediator } from 'mediateur';
import {
  ConsulterDossierRaccordementQuery,
  ConsulterDépôtGarantiesFinancièresQuery,
  ConsulterGarantiesFinancièresQuery,
  ListerDossiersRaccordementQuery,
  ConsulterSuiviDépôtGarantiesFinancièresQuery,
} from '@potentiel/domain-views';
import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnRawIdentifiantProjet,
} from '@potentiel/domain';
import { Project } from '../../infra/sequelize';
import { isNone, isSome } from '@potentiel/monads';
import { AlerteRaccordement } from '../../views/pages/projectDetailsPage';
import { UtilisateurReadModel } from '../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { userIs } from '../../modules/users';
import { addQueryParams } from '../../helpers/addQueryParams';

const schema = yup.object({
  params: yup.object({ projectId: yup.string().required() }),
});

v1Router.get(
  routes.PROJECT_DETAILS(),
  vérifierPermissionUtilisateur(PermissionConsulterProjet),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const { user } = request;

      if (estUnRawIdentifiantProjet(request.params.projectId)) {
        const projectId = await getIdentifiantLegacyProjet(request.params.projectId);
        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            error: request.query.error,
          }),
        );
      }

      const projectId = request.params.projectId;

      if (!projectId) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      // VÉRIFICATION DES DROITS

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

      // RÉCUPÉRATION DU PROJET

      const rawProjet = await getProjectDataForProjectPage({ projectId, user });

      if (rawProjet.isErr()) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const projet = rawProjet.value;

      const identifiantFonctionnelProjet = {
        appelOffre: projet.appelOffreId,
        période: projet.periodeId,
        famille: projet.familleId,
        numéroCRE: projet.numeroCRE,
      };

      // DONNÉES DE RACCORDEMENT

      const alertesRaccordement = await getAlertesRaccordement({
        userRole: user.role,
        identifiantProjet: identifiantFonctionnelProjet,
        CDC2022Choisi:
          projet.cahierDesChargesActuel.type === 'modifié' &&
          projet.cahierDesChargesActuel.paruLe === '30/08/2022',
        projet: {
          isClasse: projet.isClasse,
          isAbandonned: projet.isAbandoned,
        },
      });

      // GARANTIES FINANCIÈRES

      const garantiesFinancières = projet.appelOffre.isSoumisAuxGF
        ? await getGarantiesFinancièresDataForProjetPage({
            identifiantProjet: identifiantFonctionnelProjet,
            user,
            statutProjet: projet.isAbandoned ? 'abandonné' : projet.isClasse ? 'classé' : 'éliminé',
          })
        : undefined;

      // ÉTAPES DU PROJET (PROJECT EVENTS)

      const rawProjectEventList = await getProjectEvents({ projectId: projet.id, user });

      if (rawProjectEventList.isErr()) {
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

      return response.send(
        ProjectDetailsPage({
          request,
          project: projet,
          projectEventList: rawProjectEventList.value,
          alertesRaccordement,
          garantiesFinancières,
        }),
      );
    },
  ),
);

// FONCTIONS PRIVÉES

const getIdentifiantLegacyProjet = async (identifiantProjet: RawIdentifiantProjet) => {
  const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);
  const projetLegacy = await Project.findOne({
    where: {
      appelOffreId: identifiantProjetValueType.appelOffre,
      periodeId: identifiantProjetValueType.période,
      familleId: isSome(identifiantProjetValueType.famille)
        ? identifiantProjetValueType.famille
        : '',
      numeroCRE: identifiantProjetValueType.numéroCRE,
    },
    attributes: ['id'],
  });

  return projetLegacy?.id;
};

const getAlertesRaccordement = async ({
  userRole,
  identifiantProjet,
  CDC2022Choisi,
  projet,
}: {
  userRole: UtilisateurReadModel['role'];
  identifiantProjet: IdentifiantProjet;
  CDC2022Choisi: boolean;
  projet: {
    isClasse: boolean;
    isAbandonned: boolean;
  };
}) => {
  if (userRole !== 'porteur-projet' || !projet.isClasse || projet.isAbandonned) {
    return;
  }

  let alertes: Array<AlerteRaccordement> = [];

  const { références } = await mediator.send<ListerDossiersRaccordementQuery>({
    type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
    data: { identifiantProjet },
  });

  if (CDC2022Choisi && (références.length === 0 || références[0] === 'Référence non transmise')) {
    alertes.push('référenceDossierManquantePourDélaiCDC2022');
  }

  if (références.length === 0) {
    alertes.push('demandeComplèteRaccordementManquante');
  } else {
    const dossier = await mediator.send<ConsulterDossierRaccordementQuery>({
      type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
      data: { identifiantProjet, référenceDossierRaccordement: références[0] },
    });

    if (
      isNone(dossier) ||
      (isSome(dossier) && !dossier.demandeComplèteRaccordement.accuséRéception)
    ) {
      alertes.push('demandeComplèteRaccordementManquante');
    }
  }

  return alertes.length > 0 ? alertes : undefined;
};

type GarantiesFinancièresDataForProjetPage = {
  actionRequise?: 'compléter enregistrement' | 'enregistrer' | 'déposer' | 'compléter dépôt';
  actuelles?: {
    typeGarantiesFinancières?: "avec date d'échéance" | 'consignation' | '6 mois après achèvement';
    dateÉchéance?: string;
    attestationConstitution?: { format: string; date: string };
  };
  dépôt?: {
    typeGarantiesFinancières?: "avec date d'échéance" | 'consignation' | '6 mois après achèvement';
    dateÉchéance?: string;
    attestationConstitution: { format: string; date: string };
  };
};

const getGarantiesFinancièresDataForProjetPage = async ({
  identifiantProjet,
  user,
  statutProjet,
}: {
  identifiantProjet: IdentifiantProjet;
  user: UtilisateurReadModel;
  statutProjet: 'abandonné' | 'classé' | 'éliminé';
}): Promise<GarantiesFinancièresDataForProjetPage | undefined> => {
  let actionRequise: GarantiesFinancièresDataForProjetPage['actionRequise'];

  if (
    !userIs(['porteur-projet', 'admin', 'dgec-validateur', 'dreal', 'caisse-des-dépôts', 'cre'])(
      user,
    )
  ) {
    return;
  }

  const garantiesFinancièresActuelles = await mediator.send<ConsulterGarantiesFinancièresQuery>({
    type: 'CONSULTER_GARANTIES_FINANCIÈRES',
    data: { identifiantProjet },
  });

  const garantiesFinancièresDéposées = await mediator.send<ConsulterDépôtGarantiesFinancièresQuery>(
    {
      type: 'CONSULTER_DÉPÔT_GARANTIES_FINANCIÈRES',
      data: { identifiantProjet },
    },
  );

  const suiviDépôtsGarantiesFinancières =
    await mediator.send<ConsulterSuiviDépôtGarantiesFinancièresQuery>({
      type: 'CONSULTER_SUIVI_DÉPÔT_GARANTIES_FINANCIÈRES',
      data: { identifiantProjet },
    });

  if (statutProjet !== 'classé') {
    return {
      ...(isSome(garantiesFinancièresActuelles) && { actuelles: garantiesFinancièresActuelles }),
    };
  }

  if (
    isSome(garantiesFinancièresDéposées) &&
    (!garantiesFinancièresDéposées.typeGarantiesFinancières ||
      !garantiesFinancièresDéposées.attestationConstitution ||
      (garantiesFinancièresDéposées.typeGarantiesFinancières === "avec date d'échéance" &&
        !garantiesFinancièresDéposées.dateÉchéance))
  ) {
    actionRequise = 'compléter dépôt';
  } else if (
    isSome(suiviDépôtsGarantiesFinancières) &&
    suiviDépôtsGarantiesFinancières.statutDépôt === 'en attente'
  ) {
    actionRequise = 'déposer';
  } else if (
    isSome(garantiesFinancièresActuelles) &&
    (!garantiesFinancièresActuelles.typeGarantiesFinancières ||
      !garantiesFinancièresActuelles.attestationConstitution ||
      (garantiesFinancièresActuelles.typeGarantiesFinancières === "avec date d'échéance" &&
        !garantiesFinancièresActuelles.dateÉchéance))
  ) {
    actionRequise = 'compléter enregistrement';
  } else if (isNone(garantiesFinancièresActuelles) && isNone(suiviDépôtsGarantiesFinancières)) {
    actionRequise = 'enregistrer';
  }

  return {
    actionRequise,
    ...(isSome(garantiesFinancièresActuelles) && { actuelles: garantiesFinancièresActuelles }),
    ...(isSome(garantiesFinancièresDéposées) && { dépôt: garantiesFinancièresDéposées }),
  };
};
