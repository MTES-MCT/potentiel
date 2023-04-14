import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse } from '../helpers';
import { listerDossiersRaccordementQueryHandlerFactory } from '@potentiel/domain';
import { Project } from '@infra/sequelize/projectionsNext';
import { findProjection } from '@potentiel/pg-projections';

const listerDossiersRaccordement = listerDossiersRaccordementQueryHandlerFactory({
  find: findProjection,
});

const schema = yup.object({
  params: yup.object({ projetId: yup.string().uuid().required() }),
});

v1Router.get(
  routes.GET_LISTE_DOSSIERS_RACCORDEMENT(),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        user,
        params: { projetId },
      } = request;

      const projet = await Project.findByPk(projetId);

      if (!projet) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      // const dossiersRaccordement = listerDossiersRaccordement({

      // })

      const { références } = await listerDossiersRaccordement({
        identifiantProjet: {
          appelOffre: projet.appelOffreId,
          période: projet.periodeId,
          famille: projet.familleId,
          numéroCRE: projet.numeroCRE,
        },
      });

      if (références.length > 0) {
        return response.send(); //TODO
      } else {
        return response.redirect(
          routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(projetId),
        );
      }
    },
  ),
);
