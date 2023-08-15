import routes from '../../routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { TransmettreDemandeComplèteRaccordementPage } from '../../views';
import { mediator } from 'mediateur';
import {
  PermissionTransmettreDemandeComplèteRaccordement,
  convertirEnIdentifiantProjet,
  estUnRawIdentifiantProjet,
} from '@potentiel/domain';
import { ConsulterProjetQuery, ListerGestionnaireRéseauQuery } from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';
import { getProjectAppelOffre } from '../../config';

const schema = yup.object({
  params: yup.object({ identifiantProjet: yup.string().required() }),
});

v1Router.get(
  routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(),
  vérifierPermissionUtilisateur(PermissionTransmettreDemandeComplèteRaccordement),
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

      const gestionnairesRéseau = await mediator.send<ListerGestionnaireRéseauQuery>({
        type: 'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
        data: {},
      });

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

      return response.send(
        TransmettreDemandeComplèteRaccordementPage({
          user,
          gestionnairesRéseau,
          projet,
          error: error as string,
          delaiDemandeDeRaccordementEnMois: appelOffre.periode.delaiDcrEnMois,
        }),
      );
    },
  ),
);
