import * as yup from 'yup';

import { annulerDemandeAbandon, ensureRole, getIdentifiantProjetByLegacyId } from '../../config';
import { logger, wrapInfra } from '../../core/utils';
import asyncHandler from '../helpers/asyncHandler';
import { EntityNotFoundError, UnauthorizedError } from '../../modules/shared';
import routes from '../../routes';
import {
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  validateRequestBody,
} from '../helpers';
import { v1Router } from '../v1Router';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  convertirEnIdentifiantUtilisateur,
} from '@potentiel/domain-usecases';
import { isSome, none } from '@potentiel/monads';
import { ConsulterAbandonQuery } from '@potentiel/domain-views';

const requestBodySchema = yup.object({
  modificationRequestId: yup.string().uuid().required(),
  projectId: yup.string().uuid().required(),
});

v1Router.post(
  routes.ANNULER_ABANDON,
  ensureRole(['porteur-projet']),
  asyncHandler(async (request, response) => {
    const { projectId, modificationRequestId } = request.body;

    const sendToMediator = new Promise<void>(async (resolve) => {
      const result = await getIdentifiantProjetByLegacyId(projectId);

      const identifiantProjet = convertirEnIdentifiantProjet({
        appelOffre: result?.appelOffre || '',
        famille: result?.famille || none,
        numéroCRE: result?.numéroCRE || '',
        période: result?.période || '',
      });

      const abandon = await mediator.send<ConsulterAbandonQuery>({
        type: 'CONSULTER_ABANDON',
        data: {
          identifiantProjet,
        },
      });

      if (isSome(abandon)) {
        try {
          await mediator.send<DomainUseCase>({
            type: 'ANNULER_ABANDON_USECASE',
            data: {
              dateAnnulationAbandon: convertirEnDateTime(new Date()),
              annuléPar: convertirEnIdentifiantUtilisateur(request.user.email),
              identifiantProjet: convertirEnIdentifiantProjet({
                appelOffre: identifiantProjet?.appelOffre || '',
                famille: identifiantProjet?.famille || none,
                numéroCRE: identifiantProjet?.numéroCRE || '',
                période: identifiantProjet?.période || '',
              }),
            },
          });
        } catch (e) {
          logger.error(e);
        }
      }

      resolve();
    });

    validateRequestBody(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { user } = request;
        const { modificationRequestId } = body;

        return annulerDemandeAbandon({
          user,
          demandeAbandonId: modificationRequestId,
        }).map(() => modificationRequestId);
      })
      .andThen(() => wrapInfra(sendToMediator))
      .match(
        () =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Votre demande a bien été annulée.',
              redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
              redirectTitle: 'Retourner à la demande',
            }),
          ),
        (e) => {
          if (e instanceof EntityNotFoundError) {
            return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
          } else if (e instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response });
          }

          logger.error(e);
          return errorResponse({ request, response });
        },
      );
  }),
);
