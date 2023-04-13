import { listerDossiersRaccordementQueryHandlerFactory } from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
import routes from '@routes';
import { DossiersRaccordementPage } from '@views';
import { v1Router } from '../v1Router';
import { Project } from '@infra/sequelize/projectionsNext';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse } from '../helpers';

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

      if (projet) {
        const dossiersRaccordement = await listerDossiersRaccordement({
          identifiantProjet: {
            appelOffre: projet.appelOffreId,
            période: projet.periodeId,
            famille: projet.familleId,
            numéroCRE: projet.numeroCRE,
          },
        });

        return response.send(
          DossiersRaccordementPage({
            user,
            dossiersRaccordement,
          }),
        );
      }
    },
  ),
);
