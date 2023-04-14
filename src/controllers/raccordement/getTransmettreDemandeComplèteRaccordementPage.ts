import {
  formatIdentifiantProjet,
  listerGestionnaireRéseauQueryHandlerFactory,
} from '@potentiel/domain';
import { listProjection } from '@potentiel/pg-projections';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse } from '../helpers';
import { TransmettreDemandeComplèteRaccordementPage } from '@views';
import { Project } from '@infra/sequelize/projectionsNext';

const listerGestionnaireRéseau = listerGestionnaireRéseauQueryHandlerFactory({
  list: listProjection,
});

const schema = yup.object({
  params: yup.object({ projetId: yup.string().uuid().required() }),
});

v1Router.get(
  routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT(),
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
        const identifiantProjet = formatIdentifiantProjet({
          appelOffre: projet.appelOffreId,
          période: projet.periodeId,
          famille: projet.familleId,
          numéroCRE: projet.numeroCRE,
        });

        const gestionnairesRéseau = await listerGestionnaireRéseau({});

        return response.send(
          TransmettreDemandeComplèteRaccordementPage({
            user,
            identifiantProjet,
            gestionnairesRéseau,
          }),
        );
      }
    },
  ),
);
