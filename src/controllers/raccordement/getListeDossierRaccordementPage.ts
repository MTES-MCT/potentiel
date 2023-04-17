import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import {
  PermissionConsulterDossierRaccordement,
  consulterDossierRaccordementQueryHandlerFactory,
  listerDossiersRaccordementQueryHandlerFactory,
} from '@potentiel/domain';
import { Project } from '@infra/sequelize/projectionsNext';
import { findProjection } from '@potentiel/pg-projections';
import { ListeDossiersRaccordementPage } from '@views';

const listerDossiersRaccordement = listerDossiersRaccordementQueryHandlerFactory({
  find: findProjection,
});

const consulterDossierRaccordement = consulterDossierRaccordementQueryHandlerFactory({
  find: findProjection,
});

const schema = yup.object({
  params: yup.object({ projetId: yup.string().uuid().required() }),
});

v1Router.get(
  routes.GET_LISTE_DOSSIERS_RACCORDEMENT(),
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
        params: { projetId },
      } = request;

      const projet = await Project.findByPk(projetId, {
        attributes: ['appelOffreId', 'periodeId', 'familleId', 'numeroCRE', 'nomProjet'],
      });

      if (!projet) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      const { références } = await listerDossiersRaccordement({
        identifiantProjet: {
          appelOffre: projet.appelOffreId,
          période: projet.periodeId,
          famille: projet.familleId,
          numéroCRE: projet.numeroCRE,
        },
      });

      if (références.length > 0) {
        const dossiers = await Promise.all(
          références.map((référence) => consulterDossierRaccordement({ référence })),
        );
        return response.send(
          ListeDossiersRaccordementPage({
            dossiers,
            user,
            projetId,
            nomProjet: projet.nomProjet,
          }),
        );
      }

      return response.redirect(routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(projetId));
    },
  ),
);
