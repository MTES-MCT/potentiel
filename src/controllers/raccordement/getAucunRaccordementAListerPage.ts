import routes from '../../routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import {
  ConsulterLegacyProjetQuery,
  PermissionConsulterDossierRaccordement,
} from '@potentiel/domain-views';
import { AucunDossierAListerPage } from '../../views';
import { isNone } from '@potentiel/monads';
import { convertirEnIdentifiantProjet, estUnRawIdentifiantProjet } from '@potentiel/domain';
import { mediator } from 'mediateur';

const schema = yup.object({
  params: yup.object({ identifiantProjet: yup.string().required() }),
});

v1Router.get(
  routes.GET_PAGE_RACCORDEMENT_SANS_DOSSIER_PAGE(),
  vérifierPermissionUtilisateur(PermissionConsulterDossierRaccordement),
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
      } = request;

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      const projet = await mediator.send<ConsulterLegacyProjetQuery>({
        type: 'CONSULTER_LEGACY_PROJET',
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

      response.send(
        AucunDossierAListerPage({
          user,
          projet,
        }),
      );
    },
  ),
);
