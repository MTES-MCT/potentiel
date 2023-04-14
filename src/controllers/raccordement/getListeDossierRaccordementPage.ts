import {
  listerDossiersRaccordementQueryHandlerFactory,
  listerGestionnaireRéseauQueryHandlerFactory,
} from '@potentiel/domain';
import { findProjection, listProjection } from '@potentiel/pg-projections';
import routes from '@routes';
import { v1Router } from '../v1Router';
import { Project } from '@infra/sequelize/projectionsNext';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse } from '../helpers';
import { TransmettreDemandeComplèteRaccordementPage } from '@views';

const listerDossiersRaccordement = listerDossiersRaccordementQueryHandlerFactory({
  find: findProjection,
});

const listerGestionnaireRéseau = listerGestionnaireRéseauQueryHandlerFactory({
  list: listProjection,
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

      // const projet = await Project.findByPk(projetId);

      // if (projet) {
      //   const dossiersRaccordement = await listerDossiersRaccordement({
      //     identifiantProjet: {
      //       appelOffre: projet.appelOffreId,
      //       période: projet.periodeId,
      //       famille: projet.familleId,
      //       numéroCRE: projet.numeroCRE,
      //     },
      //   });

      //   const gestionnairesRéseau = await listerGestionnaireRéseau({});

        return response.send(
          TransmettreDemandeComplèteRaccordementPage({
            user,
            gestionnairesRéseau,
          }),
        );
      }
    },
  ),
);
