import * as yup from 'yup';

import { confirmerDemandeAbandon, ensureRole, getIdentifiantProjetByLegacyId } from '../../config';
import { logger, wrapInfra } from '../../core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import { UnauthorizedError } from '../../modules/shared';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { errorResponse, unauthorizedResponse } from '../helpers';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  convertirEnIdentifiantUtilisateur,
} from '@potentiel/domain-usecases';
import { isSome, none } from '@potentiel/monads';
import { ConsulterAbandonQuery } from '@potentiel/domain-views';

const schema = yup.object({
  body: yup.object({
    demandeAbandonId: yup.string().uuid().required(),
    projectId: yup.string().uuid().required(),
  }),
});

v1Router.post(
  routes.CONFIRMER_DEMANDE_ABANDON,
  ensureRole(['porteur-projet']),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(routes.GET_DEMANDER_ABANDON(request.body.projectId), {
            ...error.errors,
          }),
        ),
    },
    async (request, response) => {
      const { user } = request;
      const { projectId, demandeAbandonId } = request.body;

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
              type: 'CONFIRMER_ABANDON_USECASE',
              data: {
                dateConfirmationAbandon: convertirEnDateTime(new Date()),
                confirméPar: convertirEnIdentifiantUtilisateur(request.user.email),
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

      return confirmerDemandeAbandon({
        confirméPar: user,
        demandeAbandonId,
      })
        .andThen(() => wrapInfra(sendToMediator))
        .match(
          () => {
            return response.redirect(
              routes.SUCCESS_OR_ERROR_PAGE({
                success: `Votre demande d'abandon a bien été envoyée.`,
                redirectUrl: routes.PROJECT_DETAILS(projectId),
                redirectTitle: 'Retourner à la page projet',
              }),
            );
          },
          (error) => {
            if (error instanceof UnauthorizedError) {
              return unauthorizedResponse({ request, response });
            }

            logger.error(error);
            return errorResponse({
              request,
              response,
              customMessage:
                'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
            });
          },
        );
    },
  ),
);
