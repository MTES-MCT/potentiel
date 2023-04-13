import {
  PermissionListerGestionnairesRéseau,
  listerDossiersRaccordementQueryHandlerFactory,
} from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
import routes from '@routes';
import { ListeGestionnairesRéseauPage } from '@views';
import asyncHandler from '../helpers/asyncHandler';
import { v1Router } from '../v1Router';
import { Project } from '@infra/sequelize/projectionsNext';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse } from '../helpers';

const listerDossiersRaccordement = listerDossiersRaccordementQueryHandlerFactory({
  find: findProjection,
});

const schema = yup.object({
  params: yup.object({ projectId: yup.string().uuid().required() }),
});

v1Router.get(
  routes.GET_LISTE_DOSSIERS_RACCORDEMENT,
  safeAsyncHandler({
    schema,
    onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
  }, async (request, response) => {
    
    const {
      user,
      query: { projectId },
    } = request;

    const projet = Project.findByPk(projectId)

    const gestionnairesRéseau = await listerDossiersRaccordement({
      identifiantProjet: 
    });
    return response.send(
      ListeGestionnairesRéseauPage({
        user,
        gestionnairesRéseau,
        success: success as string,
      }),
    );
  }),
);
