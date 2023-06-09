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
import { TransmettrePropositionTechniqueEtFinancièrePage } from '@views';
import { mediator } from 'mediateur';
import { isNone, none } from '@potentiel/monads';
import {
  ConsulterDossierRaccordementQuery,
  ConsulterGestionnaireRéseauQuery,
  ConsulterProjetQuery,
} from '@potentiel/domain-views';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().uuid().required(),
    reference: yup.string().required(),
  }),
});

v1Router.get(
  routes.GET_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE_PAGE(),
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

      return response.send(
        TransmettrePropositionTechniqueEtFinancièrePage({
          user,
          projet,
          reference,
          dateSignatureActuelle:
            dossierRaccordement.propositionTechniqueEtFinancière?.dateSignature,
          error: error as string,
        }),
      );
    },
  ),
);
