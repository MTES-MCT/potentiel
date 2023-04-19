import { PermissionTransmettreDateMiseEnService } from '@potentiel/domain';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { TransmettreDateMiseEnServicePage } from '@views';
import { Project } from '@infra/sequelize/projectionsNext';

const schema = yup.object({
  params: yup.object({
    projetId: yup.string().uuid().required(),
    reference: yup.string().required(),
  }),
});

v1Router.get(
  routes.GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE(),
  vérifierPermissionUtilisateur(PermissionTransmettreDateMiseEnService),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        user,
        params: { projetId, reference },
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

      if (!projet) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      return response.send(
        TransmettreDateMiseEnServicePage({
          user,
          projet,
          reference,
          error: error as string,
        }),
      );
    },
  ),
);
