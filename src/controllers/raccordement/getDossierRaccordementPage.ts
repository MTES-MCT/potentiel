import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import {
  DossierRaccordementNonRéférencéError,
  PermissionConsulterDossierRaccordement,
  consulterDossierRaccordementQueryHandlerFactory,
} from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
import { DossierRaccordementPage } from '@views';
import { logger } from '@core/utils';
import { addQueryParams } from 'src/helpers/addQueryParams';

const consulterDossierRaccordement = consulterDossierRaccordementQueryHandlerFactory({
  find: findProjection,
});

const schema = yup.object({
  params: yup.object({
    projetId: yup.string().uuid().required(),
    reference: yup.string().required(),
  }),
});

v1Router.get(
  routes.GET_DOSSIER_RACCORDEMENT_PAGE(),
  vérifierPermissionUtilisateur(PermissionConsulterDossierRaccordement),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Dossier de raccordement' }),
    },
    async (request, response) => {
      const {
        user,
        params: { projetId, reference: référence },
      } = request;

      try {
        const dossier = await consulterDossierRaccordement({ référence });
        return response.send(DossierRaccordementPage({ dossier, projetId, user }));
      } catch (error) {
        if (error instanceof DossierRaccordementNonRéférencéError) {
          return response.redirect(
            addQueryParams(routes.GET_LISTE_DOSSIERS_RACCORDEMENT(projetId), {
              error: error.message,
            }),
          );
        }
        logger.error(error);
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Dossier de raccordement',
        });
      }
    },
  ),
);
