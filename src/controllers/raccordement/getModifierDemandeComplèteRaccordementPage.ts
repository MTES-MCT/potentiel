import {
  PermissionTransmettrePropositionTechniqueEtFinancière,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
  estUnRawIdentifiantProjet,
} from '@potentiel/domain';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { ModifierDemandeComplèteRaccordementPage } from '@views';
import { mediator } from 'mediateur';
import { isNone, none } from '@potentiel/monads';
import {
  ConsulterDossierRaccordementQuery,
  ConsulterGestionnaireRéseauQuery,
  ConsulterProjetQuery,
} from '@potentiel/domain-views';
import { getProjectAppelOffre } from '@config';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
    reference: yup.string().required(),
  }),
});

v1Router.get(
  routes.GET_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(),
  vérifierPermissionUtilisateur(PermissionTransmettrePropositionTechniqueEtFinancière),
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

      const projet = await mediator.send<ConsulterProjetQuery>({
        type: 'CONSULTER_PROJET',
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

      const appelOffre = getProjectAppelOffre({
        appelOffreId: projet.appelOffre,
        periodeId: projet.période,
        familleId: projet.famille,
      });

      if (!appelOffre) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
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

      const gestionnaireRéseauActuel = projet.identifiantGestionnaire
        ? await mediator.send<ConsulterGestionnaireRéseauQuery>({
            type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
            data: {
              identifiantGestionnaireRéseau: projet.identifiantGestionnaire,
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
        ModifierDemandeComplèteRaccordementPage({
          user,
          projet,
          dossierRaccordement,
          error: error as string,
          gestionnaireRéseauActuel,
          delaiDemandeDeRaccordementEnMois: appelOffre.periode.delaiDcrEnMois,
        }),
      );
    },
  ),
);
