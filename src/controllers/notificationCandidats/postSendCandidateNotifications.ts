import moment from 'moment-timezone';
import { v4 as uuid } from 'uuid';
import { eventStore, ensureRole } from '../../config';
import { logger } from '../../core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import { PeriodeNotified } from '../../modules/project';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import asyncHandler from '../helpers/asyncHandler';

import {
  GET_LISTE_PROJETS,
  GET_NOTIFIER_CANDIDATS,
  POST_NOTIFIER_CANDIDATS,
} from '@potentiel/legacy-routes';

const FORMAT_DATE = 'DD/MM/YYYY';

v1Router.post(
  POST_NOTIFIER_CANDIDATS,
  ensureRole(['dgec-validateur']),
  asyncHandler(async (request, response) => {
    const { appelOffreId, periodeId, notificationDate } = request.body;
    if (
      !notificationDate ||
      moment(notificationDate, FORMAT_DATE).format(FORMAT_DATE) !== notificationDate
    ) {
      return response.redirect(
        addQueryParams(
          GET_NOTIFIER_CANDIDATS({
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
            notifiedOn: moment(notificationDate, FORMAT_DATE).tz('Europe/Paris').toDate().getTime(),
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
            redirectUrl: addQueryParams(GET_LISTE_PROJETS, {
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
            GET_NOTIFIER_CANDIDATS({
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
