import asyncHandler from '../helpers/asyncHandler';
import moment from 'moment-timezone';
import { regenerateCertificatesForPeriode } from '../../config/useCases.config';
import { logger } from '../../core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import routes from '../../routes';
import { ensureRole } from '../../config';
import { v1Router } from '../v1Router';

import {
  GET_LISTE_PROJETS,
  GET_REGENERER_CERTIFICATS,
  POST_REGENERER_CERTIFICATS,
} from '@potentiel/legacy-routes';

const FORMAT_DATE = 'DD/MM/YYYY';

v1Router.post(
  POST_REGENERER_CERTIFICATS,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    const {
      user,
      body: { appelOffreId, periodeId, familleId, reason, notificationDate },
    } = request;

    if (!appelOffreId || !periodeId) {
      return response.redirect(
        addQueryParams(GET_REGENERER_CERTIFICATS, {
          error: 'Il est nécessaire de choisir un appel d‘offre et une période.',
          ...request.body,
        }),
      );
    }

    if (notificationDate && !isDateFormatValid(notificationDate)) {
      return response.redirect(
        addQueryParams(GET_REGENERER_CERTIFICATS, {
          error: 'La date de notification est au mauvais format.',
          ...request.body,
        }),
      );
    }

    (
      await regenerateCertificatesForPeriode({
        appelOffreId,
        periodeId,
        familleId,
        user,
        reason,
        ...(notificationDate && {
          newNotifiedOn: moment(notificationDate, FORMAT_DATE)
            .tz('Europe/London')
            .toDate()
            .getTime(),
        }),
      })
    ).match(
      () =>
        response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: `Les attestations de la période ${appelOffreId} - ${periodeId}${
              familleId ? ` famille ${familleId}` : ''
            } sont en cours de regénération. Les porteurs de projets seront prévenus par email dès que leur nouvelle attestation sera prête.`,
            redirectUrl: addQueryParams(GET_LISTE_PROJETS, {
              appelOffreId,
              periodeId,
              familleId,
            }),
            redirectTitle: 'Voir le listing des projets concernés',
          }),
        ),
      (e: Error) => {
        logger.error(e);
        response.redirect(
          addQueryParams(GET_REGENERER_CERTIFICATS, {
            ...request.body,
            error: `Les relances n'ont pas pu être envoyées. (Erreur: ${e.message})`,
          }),
        );
      },
    );
  }),
);

function isDateFormatValid(dateStr) {
  return moment(dateStr, FORMAT_DATE).format(FORMAT_DATE) === dateStr;
}
