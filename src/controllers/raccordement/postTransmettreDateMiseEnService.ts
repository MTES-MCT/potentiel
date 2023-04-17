import {
  DossierRaccordementNonRéférencéError,
  PermissionTransmettreDateMiseEnService,
  transmettreDateMiseEnServiceCommandHandlerFactory,
} from '@potentiel/domain';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import {
  errorResponse,
  iso8601DateToDateYupTransformation,
  notFoundResponse,
  vérifierPermissionUtilisateur,
} from '../helpers';
import { Project } from '@infra/sequelize/projectionsNext';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { addQueryParams } from '../../helpers/addQueryParams';
import { logger } from '@core/utils';

const transmettreDateMiseEnService = transmettreDateMiseEnServiceCommandHandlerFactory({
  publish,
  loadAggregate,
});

const schema = yup.object({
  params: yup.object({
    projetId: yup.string().uuid().required(),
    reference: yup.string().required(),
  }),
  body: yup.object({
    dateMiseEnService: yup
      .date()
      .required(`La date de mise en service est obligatoire`)
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de mise en service n'est pas valide`),
  }),
});

v1Router.post(
  routes.POST_TRANSMETTRE_DATE_MISE_EN_SERVICE(),
  vérifierPermissionUtilisateur(PermissionTransmettreDateMiseEnService),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        params: { projetId, reference },
        body: { dateMiseEnService },
      } = request;

      const projet = await Project.findByPk(projetId, {
        attributes: ['appelOffreId', 'periodeId', 'familleId', 'numeroCRE'],
      });

      if (!projet) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      const identifiantProjet = {
        appelOffre: projet.appelOffreId,
        période: projet.periodeId,
        famille: projet.familleId,
        numéroCRE: projet.numeroCRE,
      };

      try {
        await transmettreDateMiseEnService({
          identifiantProjet,
          référenceDossierRaccordement: reference,
          dateMiseEnService,
        });

        return response.redirect(
          addQueryParams(routes.GET_LISTE_DOSSIERS_RACCORDEMENT(projetId), {
            success: 'La date de mise en service a bien été enregistrée',
          }),
        );
      } catch (error) {
        if (error instanceof DossierRaccordementNonRéférencéError) {
          return response.redirect(
            addQueryParams(routes.GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE(projetId, reference), {
              error: error.message,
            }),
          );
        }

        logger.error(error);

        return errorResponse({ request, response });
      }
    },
  ),
);
