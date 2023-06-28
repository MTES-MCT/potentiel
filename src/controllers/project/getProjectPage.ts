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

      let alertesRaccordement: Array<AlerteRaccordement> | undefined = undefined;

      if (projet.isClasse && user.role === 'porteur-projet') {
        alertesRaccordement = await getAlertesRaccordement({
          identifiantProjet: {
            appelOffre: projet.appelOffreId,
            période: projet.periodeId,
            famille: projet.familleId,
            numéroCRE: projet.numeroCRE,
          },
          CDC2022Choisi:
            projet.cahierDesChargesActuel.type === 'modifié' &&
            projet.cahierDesChargesActuel.paruLe === '30/08/2022',
        });
      }

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
        }),
      );
    },
  ),
);

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
  identifiantProjet,
  CDC2022Choisi,
}: {
  identifiantProjet: IdentifiantProjet;
  CDC2022Choisi: boolean;
}) => {
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
