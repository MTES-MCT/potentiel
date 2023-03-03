import { v4 as uuid } from 'uuid';
import { eventStore, ensureRole } from '@config';
import { logger } from '@core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import { PeriodeNotified } from '@modules/project';
import routes from '@routes';
import { v1Router } from '../v1Router';
import asyncHandler from '../helpers/asyncHandler';
import { isDateFormatValid } from '../../helpers/formValidators';
import { parse } from 'date-fns';

const FORMAT_DATE = 'dd/MM/yyyy';

v1Router.post(
  routes.POST_NOTIFIER_CANDIDATS,
  ensureRole(['dgec-validateur']),
  asyncHandler(async (request, response) => {
    const { appelOffreId, periodeId, notificationDate } = request.body;
    if (!notificationDate || isDateFormatValid(notificationDate, FORMAT_DATE)) {
      return response.redirect(
        addQueryParams(
          routes.GET_NOTIFIER_CANDIDATS({
            appelOffreId,
            periodeId,
          }),
          {
            error:
              "Les notifications n'ont pas pu être envoyées: la date de notification est erronnée.",
          },
        ),
      );
    }

    (
      await eventStore.publish(
        new PeriodeNotified({
          payload: {
            appelOffreId,
            periodeId,
            notifiedOn: parse(notificationDate, FORMAT_DATE, new Date()).getTime(),
            requestedBy: request.user.id,
          },
          requestId: uuid(),
        }),
      )
    ).match(
      () =>
        response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: `La période ${appelOffreId} - ${periodeId} a bien été notifiée.`,
            redirectUrl: addQueryParams(routes.LISTE_PROJETS, {
              appelOffreId,
              periodeId,
            }),
            redirectTitle: 'Lister les projets de cette période',
          }),
        ),
      (e: Error) => {
        logger.error(e);
        return response.redirect(
          addQueryParams(
            routes.GET_NOTIFIER_CANDIDATS({
              appelOffreId,
              periodeId,
            }),
            {
              error: "La période n'a pas pu être notifiée. (" + e.message + ')',
            },
          ),
        );
      },
    );
  }),
);
