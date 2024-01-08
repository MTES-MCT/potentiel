import {
  convertirEnIdentifiantProjet,
  estUnRawIdentifiantProjet,
} from '@potentiel/domain-usecases';
import { PermissionModifierGestionnaireRéseauProjet } from '@potentiel/legacy-permissions';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { ModifierGestionnaireRéseauProjetPage } from '../../views';
import { mediator } from 'mediateur';
import { isNone } from '@potentiel/monads';
import {
  ConsulterCandidatureLegacyQuery,
  ConsulterGestionnaireRéseauLauréatQuery,
} from '@potentiel/domain-views';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

const schema = yup.object({
  params: yup.object({ identifiantProjet: yup.string().required() }),
});

v1Router.get(
  routes.GET_MODIFIER_GESTIONNAIRE_RESEAU_PROJET_PAGE(),
  vérifierPermissionUtilisateur(PermissionModifierGestionnaireRéseauProjet),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        user,
        params: { identifiantProjet },
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

      const gestionnaireRéseauLauréat =
        await mediator.send<ConsulterGestionnaireRéseauLauréatQuery>({
          type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_LAURÉAT_QUERY',
          data: {
            identifiantProjet: identifiantProjetValueType,
          },
        });

      if (isNone(gestionnaireRéseauLauréat)) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      const { items: listeGestionnairesRéseau } =
        await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
          type: 'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
          data: {
            pagination: {
              page: 1,
              itemsPerPage: 1000,
            },
          },
        });

      return response.send(
        ModifierGestionnaireRéseauProjetPage({
          user,
          listeGestionnairesRéseau: listeGestionnairesRéseau.map((gestionnaireRéseau) => ({
            codeEIC: gestionnaireRéseau.identifiantGestionnaireRéseau.formatter(),
            raisonSociale: gestionnaireRéseau.raisonSociale,
            aideSaisieRéférenceDossierRaccordement: {
              expressionReguliere:
                gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.expressionReguliere
                  .expression,
              format: gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.format,
              légende: gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.légende,
            },
          })),
          gestionnaireRéseauLauréat,
          projet,
          error: error as string,
        }),
      );
    },
  ),
);
