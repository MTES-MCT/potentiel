import {
  PermissionTransmettreDemandeComplèteRaccordement,
  consulterProjetQueryHandlerFactory,
  listerGestionnaireRéseauQueryHandlerFactory,
} from '@potentiel/domain';
import { findProjection, listProjection } from '@potentiel/pg-projections';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { TransmettreDemandeComplèteRaccordementPage } from '@views';
import { Project } from '@infra/sequelize/projectionsNext';

const listerGestionnaireRéseau = listerGestionnaireRéseauQueryHandlerFactory({
  list: listProjection,
});

const consulterProjet = consulterProjetQueryHandlerFactory({ find: findProjection });

const schema = yup.object({
  params: yup.object({ projetId: yup.string().uuid().required() }),
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
        params: { projetId },
        query: { error },
      } = request;

      const projet = await Project.findByPk(projetId, {
        attributes: [
          'id',
          'nomProjet',
          'nomCandidat',
          'communeProjet',
          'regionProjet',
          'departementProjet',
          'periodeId',
          'familleId',
          'notifiedOn',
          'appelOffreId',
        ],
      });

      if (projet) {
        const identifiantProjet = {
          appelOffre: projet.appelOffreId,
          période: projet.periodeId,
          famille: projet.familleId,
          numéroCRE: projet.numeroCRE,
        };

        const { identifiantGestionnaire } = await consulterProjet({ identifiantProjet });

        const gestionnairesRéseau = await listerGestionnaireRéseau({});
        return response.send(
          TransmettreDemandeComplèteRaccordementPage({
            identifiantGestionnaire: identifiantGestionnaire?.codeEIC,
            user,
            gestionnairesRéseau,
            projet,
            error: error as string,
          }),
        );
      }
    },
  ),
);
