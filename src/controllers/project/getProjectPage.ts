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
import { AlerteRaccordement } from '../../views/pages/projectDetailsPage';
import { UtilisateurReadModel } from '../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { Abandon } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/reseau';

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

      const projectId = request.params.projectId;

      if (!projectId) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
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
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const projet = rawProjet.value;

      const identifiantProjet = {
        appelOffre: projet.appelOffreId,
        période: projet.periodeId,
        famille: projet.familleId,
        numéroCRE: projet.numeroCRE,
      };

      const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(
        `${projet.appelOffreId}#${projet.periodeId}#${projet.familleId}#${projet.numeroCRE}`,
      );
      const abandon = await getAbandon(identifiantProjetValueType);

      const alertesRaccordement =
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
          ...(abandon && { abandon }),
        }),
      );
    },
  ),
);

type AbandonEnInstructionProps = { statut: string } | undefined;
const getAbandon = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<AbandonEnInstructionProps> => {
  try {
    const abandonDétecté = await mediator.send<Abandon.DétecterAbandonQuery>({
      type: 'DÉTECTER_ABANDON_QUERY',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    if (!abandonDétecté) {
      return;
    }

    const { statut } = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'CONSULTER_ABANDON_QUERY',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    switch (statut.statut) {
      case 'demandé':
      case 'confirmé':
      case 'accordé':
      case 'rejeté':
        return { statut: statut.statut };
      case 'confirmation-demandée':
        return { statut: 'à confirmer' };
      default:
        return;
    }
  } catch (error) {
    return;
  }
};

const getAlertesRaccordement = async ({
  userRole,
  identifiantProjet,
  CDC2022Choisi,
  projet,
}: {
  userRole: UtilisateurReadModel['role'];
  identifiantProjet: IdentifiantProjet.ValueType;
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

  const { dossiers } = await mediator.send<Raccordement.ListerDossierRaccordementQuery>({
    type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  if (
    CDC2022Choisi &&
    (dossiers.length === 0 ||
      (dossiers.length !== 0 && dossiers[0].référence.formatter() === 'Référence non transmise'))
  ) {
    alertes.push('référenceDossierManquantePourDélaiCDC2022');
  }

  if (dossiers.length === 0) {
    alertes.push('demandeComplèteRaccordementManquante');
  } else {
    if (!dossiers[0].demandeComplèteRaccordement.accuséRéception) {
      alertes.push('demandeComplèteRaccordementManquante');
    }
  }

  return alertes.length > 0 ? alertes : undefined;
};
