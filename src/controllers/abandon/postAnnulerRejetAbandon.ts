import {
  DomainUseCase,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { isSome, none } from '@potentiel/monads';
import { mediator } from 'mediateur';
import { annulerRejetAbandon, ensureRole, getIdentifiantProjetByLegacyId } from '../../config';
import { logger, wrapInfra } from '../../core/utils';
import { EntityNotFoundError, UnauthorizedError } from '../../modules/shared';
import routes from '../../routes';
import {
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  validateRequestBody,
} from '../helpers';
import asyncHandler from '../helpers/asyncHandler';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import {
  ConsulterAbandonQuery,
  ConsulterPiéceJustificativeAbandonProjetQuery,
} from '@potentiel/domain-views';

const requestBodySchema = yup.object({
  demandeAbandonId: yup.string().uuid().required(),
  projectId: yup.string().uuid().required(),
});

v1Router.post(
  routes.ADMIN_ANNULER_ABANDON_REJETE,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { demandeAbandonId, projectId } = body;
        const { user } = request;

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

          const piéceJustificative =
            await mediator.send<ConsulterPiéceJustificativeAbandonProjetQuery>({
              type: 'CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET',
              data: {
                identifiantProjet,
              },
            });

          if (isSome(abandon) && isSome(piéceJustificative)) {
            try {
              await mediator.send<DomainUseCase>({
                type: 'ANNULER_REJET_ABANDON_USECASE',
                data: {
                  dateAnnulationAbandon: convertirEnDateTime(new Date()),
                  dateDemandeAbandon: convertirEnDateTime(abandon.demandeDemandéLe),
                  identifiantProjet,
                  piéceJustificative,
                  raison: abandon.demandeRaison,
                  recandidature: abandon.demandeRecandidature,
                },
              });
            } catch (e) {
              logger.error(e);
            }
          }

          resolve();
        });

        return annulerRejetAbandon({
          user,
          demandeAbandonId,
        })
          .andThen(() => wrapInfra(sendToMediator))
          .map(() => demandeAbandonId);
      })
      .match(
        (demandeAbandonId) =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: `La réponse à la demande d'abandon a bien été annulée.`,
              redirectUrl: routes.DEMANDE_PAGE_DETAILS(demandeAbandonId),
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
