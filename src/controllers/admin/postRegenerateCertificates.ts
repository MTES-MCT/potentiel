import asyncHandler from '../helpers/asyncHandler';
import { regenerateCertificatesForPeriode } from '@config/useCases.config';
import { logger } from '@core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import routes from '@routes';
import { ensureRole } from '@config';
import { v1Router } from '../v1Router';
import { isDateFormatValid } from '../../helpers/formValidators';
import { parse } from 'date-fns';

const FORMAT_DATE = 'dd/MM/yyyy';

v1Router.post(
  routes.ADMIN_REGENERATE_CERTIFICATES_ACTION,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    const {
      user,
      body: { appelOffreId, periodeId, familleId, reason, notificationDate },
    } = request;

    if (!appelOffreId || !periodeId) {
      return response.redirect(
        addQueryParams(routes.ADMIN_REGENERATE_CERTIFICATES, {
          error: 'Il est nécessaire de choisir un appel d‘offre et une période.',
          ...request.body,
        }),
      );
    }

    if (notificationDate && !isDateFormatValid(notificationDate, FORMAT_DATE)) {
      return response.redirect(
        addQueryParams(routes.ADMIN_REGENERATE_CERTIFICATES, {
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
          newNotifiedOn: parse(notificationDate, FORMAT_DATE, new Date()).getTime(),
        }),
      })
    ).match(
      () =>
        response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: `Les attestations de la période ${appelOffreId} - ${periodeId}${
              familleId ? ` famille ${familleId}` : ''
            } sont en cours de regénération. Les porteurs de projets seront prévenus par email dès que leur nouvelle attestation sera prête.`,
            redirectUrl: addQueryParams(routes.LISTE_PROJETS, {
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
          addQueryParams(routes.ADMIN_REGENERATE_CERTIFICATES, {
            ...request.body,
            error: `Les relances n'ont pas pu être envoyées. (Erreur: ${e.message})`,
          }),
        );
      },
    );
  }),
);
