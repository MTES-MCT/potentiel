import fs from 'fs';
import moment from 'moment';

import {
  acceptModificationRequest,
  ensureRole,
  rejectModificationRequest,
  requestConfirmation,
} from '../../config';
import { logger } from '../../core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import { validateUniqueId } from '../../helpers/validateUniqueId';
import { getModificationRequestAuthority } from '../../infra/sequelize/queries';
import {
  ModificationRequestAcceptanceParams,
  ProjetDéjàClasséError,
  PuissanceVariationWithDecisionJusticeError,
} from '../../modules/modificationRequest';
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  UnauthorizedError,
} from '../../modules/shared';
import routes from '../../routes';
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers';
import asyncHandler from '../helpers/asyncHandler';
import { upload } from '../upload';
import { v1Router } from '../v1Router';

import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

v1Router.post(
  routes.ADMIN_REPLY_TO_MODIFICATION_REQUEST,

  upload.single('file'),
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  asyncHandler(async (request, response) => {
    if (request.errorFileSizeLimit) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(request.body.modificationRequestId), {
          error: request.errorFileSizeLimit,
        }),
      );
    }

    const {
      user: { role },
      body: {
        modificationRequestId,
        type,
        versionDate,
        submitAccept,
        submitConfirm,
        puissance,
        isDecisionJustice,
        producteur,
      },
    } = request;

    let newNotificationDate: string | undefined = undefined;

    if (!validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    if (role === 'dreal') {
      const authority = await getModificationRequestAuthority(modificationRequestId);

      if (authority && authority !== role) {
        return unauthorizedResponse({ request, response });
      }
    }

    // There are two submit buttons on the form, named submitAccept and submitReject
    // We know which one has been clicked when it has a string value
    const acceptedReply = typeof submitAccept === 'string';
    const confirmReply = typeof submitConfirm === 'string';

    if (request.body.newNotificationDate) {
      newNotificationDate = format(parseISO(request.body.newNotificationDate), 'dd/MM/yyyy', {
        locale: fr,
      });
    }

    const responseFile = request.file && {
      contents: fs.createReadStream(request.file.path),
      filename: request.file.originalname,
    };

    let acceptanceParams: ModificationRequestAcceptanceParams | undefined;
    switch (type) {
      case 'recours':
        acceptanceParams = {
          type,
          newNotificationDate: moment(newNotificationDate, 'DD/MM/YYYY')
            .tz('Europe/London')
            .toDate(),
        };
        break;
      case 'puissance':
        acceptanceParams = { type, newPuissance: puissance, isDecisionJustice };
        break;
      case 'producteur':
        acceptanceParams = { type, newProducteur: producteur };
        break;
    }

    if (acceptedReply) {
      return await acceptModificationRequest({
        responseFile,
        modificationRequestId,
        versionDate: new Date(Number(versionDate)),
        acceptanceParams,
        submittedBy: request.user,
      }).match(
        async () => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Votre réponse a bien été enregistrée.',
              redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
              redirectTitle: 'Retourner à la demande',
            }),
          );
        },
        _handleErrors(request, response, modificationRequestId),
      );
    }

    if (confirmReply) {
      return await requestConfirmation({
        modificationRequestId,
        versionDate: new Date(Number(versionDate)),
        responseFile: responseFile!,
        confirmationRequestedBy: request.user,
      }).match(
        _handleSuccess(response, modificationRequestId),
        _handleErrors(request, response, modificationRequestId),
      );
    }

    return rejectModificationRequest({
      responseFile,
      modificationRequestId,
      versionDate: new Date(Number(versionDate)),
      rejectedBy: request.user,
    }).match(
      _handleSuccess(response, modificationRequestId),
      _handleErrors(request, response, modificationRequestId),
    );
  }),
);

function _handleSuccess(response, modificationRequestId) {
  return () => {
    response.redirect(
      routes.SUCCESS_OR_ERROR_PAGE({
        success: 'Votre réponse a bien été enregistrée.',
        redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
        redirectTitle: 'Retourner à la demande',
      }),
    );
  };
}

function _handleErrors(request, response, modificationRequestId) {
  return (e) => {
    if (e instanceof AggregateHasBeenUpdatedSinceError) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error: `Votre réponse n'a pas pu être prise en compte parce que la demande a été mise à jour entre temps. Merci de réessayer.`,
        }),
      );
    }

    if (e instanceof PuissanceVariationWithDecisionJusticeError) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error: e.message,
        }),
      );
    }

    if (e instanceof ProjetDéjàClasséError) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error: `Vous ne pouvez pas accepter cette demande de recours car le projet est déjà "classé". Le porteur a la possibilité d'annuler sa demande, ou bien vous pouvez la rejeter.`,
        }),
      );
    }

    if (e instanceof EntityNotFoundError) {
      return notFoundResponse({ request, response });
    }

    if (e instanceof UnauthorizedError) {
      return unauthorizedResponse({ request, response });
    }

    logger.error(e);

    return errorResponse({ request, response });
  };
}
