import {
  DomainUseCase,
  PermissionTransmettreDateMiseEnService,
  RawIdentifiantProjet,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
  estUnRawIdentifiantProjet,
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
import { addQueryParams } from '../../helpers/addQueryParams';
import { logger } from '@core/utils';
import { mediator } from 'mediateur';
import { DomainError } from '@potentiel/core-domain';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
    reference: yup.string().required(),
  }),
  body: yup.object({
    dateMiseEnService: yup
      .date()
      .required(`La date de mise en service est obligatoire.`)
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de mise en service n'est pas valide.`),
  }),
});

v1Router.post(
  routes.POST_TRANSMETTRE_DATE_MISE_EN_SERVICE(),
  vérifierPermissionUtilisateur(PermissionTransmettreDateMiseEnService),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(
            routes.GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE(
              request.params.identifiantProjet as RawIdentifiantProjet,
              request.params.reference,
            ),
            {
              error: `La date de mise en service n'a pas pu être transmise. ${error.errors.join(
                ' ',
              )}`,
            },
          ),
        ),
    },
    async (request, response) => {
      const {
        params: { identifiantProjet, reference },
        body: { dateMiseEnService },
      } = request;

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      try {
        await mediator.send<DomainUseCase>({
          type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
          data: {
            identifiantProjet: identifiantProjetValueType,
            référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(reference),
            dateMiseEnService: convertirEnDateTime(dateMiseEnService),
          },
        });

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'La date de mise en service a bien été enregistrée',
            redirectUrl: routes.GET_LISTE_DOSSIERS_RACCORDEMENT(identifiantProjet),
            redirectTitle: 'Retourner sur la page raccordement',
          }),
        );
      } catch (error) {
        if (error instanceof DomainError) {
          return response.redirect(
            addQueryParams(
              routes.GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE(identifiantProjet, reference),
              {
                error: error.message,
              },
            ),
          );
        }

        logger.error(error);

        return errorResponse({ request, response });
      }
    },
  ),
);
