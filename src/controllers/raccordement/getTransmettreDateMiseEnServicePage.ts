import {
  PermissionTransmettreDateMiseEnService,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
  estUnRawIdentifiantProjet,
} from '@potentiel/domain';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { errorResponse, notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { TransmettreDateMiseEnServicePage } from '../../views';
import { mediator } from 'mediateur';
import { isNone, isSome, none } from '@potentiel/monads';
import {
  ConsulterCandidatureLegacyQuery,
  ConsulterDossierRaccordementQuery,
  ConsulterGestionnaireRéseauLauréatQuery,
  ConsulterGestionnaireRéseauQuery,
} from '@potentiel/domain-views';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
    reference: yup.string().required(),
  }),
});

v1Router.get(
  routes.GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE(),
  vérifierPermissionUtilisateur(PermissionTransmettreDateMiseEnService),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        user,
        params: { identifiantProjet, reference },
        query: { error },
      } = request;

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      const projet = await mediator.send<ConsulterCandidatureLegacyQuery>({
        type: 'CONSULTER_CANDIDATURE_LEGACY_QUERY',
        data: {
          identifiantProjet: identifiantProjetValueType,
        },
      });

      if (isNone(projet)) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      if (projet.statut === 'non-notifié') {
        return errorResponse({
          request,
          response,
          customMessage: "Action indisponible car le projet n'est pas notifié",
        });
      }

      const dossierRaccordement = await mediator.send<ConsulterDossierRaccordementQuery>({
        type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
        data: {
          identifiantProjet: identifiantProjetValueType,
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(reference),
        },
      });

      if (isNone(dossierRaccordement)) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Dossier de raccordement',
        });
      }

      const gestionnaireRéseauLauréat =
        await mediator.send<ConsulterGestionnaireRéseauLauréatQuery>({
          type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_LAURÉAT_QUERY',
          data: {
            identifiantProjet: identifiantProjetValueType,
          },
        });

      const gestionnaireRéseauActuel = isSome(gestionnaireRéseauLauréat)
        ? await mediator.send<ConsulterGestionnaireRéseauQuery>({
            type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
            data: {
              identifiantGestionnaireRéseau: gestionnaireRéseauLauréat.identifiantGestionnaire,
            },
          })
        : none;

      if (isNone(gestionnaireRéseauActuel)) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Gestionnaire de réseau',
        });
      }

      return response.send(
        TransmettreDateMiseEnServicePage({
          user,
          projet,
          dossierRaccordement,
          error: error as string,
        }),
      );
    },
  ),
);
