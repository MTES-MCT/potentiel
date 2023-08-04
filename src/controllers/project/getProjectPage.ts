import { getProjectEvents } from '@config';
import { getProjectDataForProjectPage } from '@config/queries.config';
import { shouldUserAccessProject } from '@config/useCases.config';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import { ProjectDetailsPage } from '@views';
import {
  notFoundResponse,
  unauthorizedResponse,
  miseAJourStatistiquesUtilisation,
  vérifierPermissionUtilisateur,
} from '../helpers';
import routes from '@routes';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { PermissionConsulterProjet } from '@modules/project';
import { mediator } from 'mediateur';
import {
  ConsulterDossierRaccordementQuery,
  ConsulterGarantiesFinancièresQuery,
  ListerDossiersRaccordementQuery,
} from '@potentiel/domain-views';
import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnRawIdentifiantProjet,
} from '@potentiel/domain';
import { Project } from '@infra/sequelize';
import { isNone, isSome } from '@potentiel/monads';
import { AlerteRaccordement } from '@views/pages/projectDetailsPage';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { userIs } from '@modules/users';
import { User } from '@entities';

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
        return response.redirect(routes.PROJECT_DETAILS(projectId));
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
            garantiesFinancièresSoumisesÀLaCandidature:
              projet.appelOffre.famille?.soumisAuxGarantiesFinancieres === 'à la candidature'
                ? true
                : projet.appelOffre.soumisAuxGarantiesFinancieres === 'à la candidature'
                ? true
                : false,
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
  actionRequise?: 'compléter enregistrement' | 'enregistrer' | 'déposer';
  typeGarantiesFinancières?: "avec date d'échéance" | 'consignation' | '6 mois après achèvement';
  dateÉchéance?: string;
  attestationConstitution?: { format: string; date: string };
};

// TO DO : A DISCUTER POUR DÉPLACEMENT COTÉ PACKAGES OU NON
const getGarantiesFinancièresDataForProjetPage = async ({
  identifiantProjet,
  garantiesFinancièresSoumisesÀLaCandidature,
  user,
}: {
  identifiantProjet: IdentifiantProjet;
  garantiesFinancièresSoumisesÀLaCandidature: boolean;
  user: User;
}): Promise<GarantiesFinancièresDataForProjetPage | undefined> => {
  const garantiesFinancières = await mediator.send<ConsulterGarantiesFinancièresQuery>({
    type: 'CONSULTER_GARANTIES_FINANCIÈRES',
    data: { identifiantProjet },
  });

  const utilisateurPeurEnregistrer = userIs([
    'porteur-projet',
    'admin',
    'dgec-validateur',
    'dreal',
    'caisse-des-dépôts',
    'cre',
  ])(user);

  if (isNone(garantiesFinancières)) {
    if (garantiesFinancièresSoumisesÀLaCandidature && utilisateurPeurEnregistrer) {
      return { actionRequise: 'enregistrer' };
    }

    if (!garantiesFinancièresSoumisesÀLaCandidature && userIs('porteur-projet')(user)) {
      return { actionRequise: 'déposer' };
    }

    return;
  }

  const { typeGarantiesFinancières, dateÉchéance, attestationConstitution } = garantiesFinancières;

  if (
    !typeGarantiesFinancières ||
    !attestationConstitution ||
    (typeGarantiesFinancières === "avec date d'échéance" && !dateÉchéance)
  ) {
    return {
      ...garantiesFinancières,
      ...(utilisateurPeurEnregistrer && { actionRequise: 'compléter enregistrement' }),
    };
  }

  return { ...garantiesFinancières };
};
