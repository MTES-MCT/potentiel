import fs from 'fs';
import {
  acceptModificationRequest,
  ensureRole,
  rejectModificationRequest,
  requestConfirmation,
} from '../../config';
import { logger } from '../../core/utils';
import { getModificationRequestAuthority } from '../../infra/sequelize/queries';
import { addQueryParams } from '../../helpers/addQueryParams';
import { isDateFormatValid, isStrictlyPositiveNumber } from '../../helpers/formValidators';
import { validateUniqueId } from '../../helpers/validateUniqueId';
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
import { errorResponse, isSoumisAuxGF, notFoundResponse, unauthorizedResponse } from '../helpers';
import asyncHandler from '../helpers/asyncHandler';
import { upload } from '../upload';
import { v1Router } from '../v1Router';
import moment from 'moment';

/* eslint-disable import/no-duplicates */
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { ModificationRequest, Project } from '../../infra/sequelize';
import { mediator } from 'mediateur';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';

const FORMAT_DATE = 'DD/MM/YYYY';

v1Router.post(
  routes.ADMIN_REPLY_TO_MODIFICATION_REQUEST,

  upload.single('file'),
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  asyncHandler(async (request, response) => {
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
        actionnaire,
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
    if (
      type === 'recours' &&
      newNotificationDate &&
      !isDateFormatValid(newNotificationDate, FORMAT_DATE)
    ) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error: "La réponse n'a pas pu être envoyée: la date de notification est erronnée.",
        }),
      );
    }

    if (type === 'puissance' && !isStrictlyPositiveNumber(puissance)) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error:
            "La réponse n'a pas pu être envoyée: la puissance doit être un nombre supérieur à 0.",
        }),
      );
    }

    const responseFile = request.file && {
      contents: fs.createReadStream(request.file.path),
      filename: request.file.originalname,
    };

    const courrierReponseIsOk = responseFile || (acceptedReply && isDecisionJustice);

    if (!courrierReponseIsOk) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error:
            "La réponse n'a pas pu être envoyée car il manque le courrier de réponse (obligatoire pour cette réponse).",
        }),
      );
    }

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
      case 'actionnaire':
        acceptanceParams = { type, newActionnaire: actionnaire };
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
      }).match(async () => {
        if (type === 'recours' || type === 'producteur') {
          try {
            // récupérer identifiant projet value
            const modificationRequest = await ModificationRequest.findByPk(modificationRequestId);
            if (!modificationRequest) {
              return notFoundResponse({ request, response });
            }
            const projet = await Project.findByPk(modificationRequest.projectId);
            if (!projet) {
              return notFoundResponse({ request, response });
            }
            const identifiantProjetValue = IdentifiantProjet.convertirEnValueType(
              `${projet.appelOffreId}#${projet.periodeId}#${projet.familleId}#${projet.numeroCRE}`,
            ).formatter();

            // récupérer appel offres
            const appelOffres = await mediator.send<ConsulterAppelOffreQuery>({
              type: 'AppelOffre.Query.ConsulterAppelOffre',
              data: { identifiantAppelOffre: projet.appelOffreId },
            });

            if (isSoumisAuxGF({ appelOffres, famille: projet.familleId })) {
              const dateActuelle = new Date();
              if (type === 'producteur') {
                // supprimer les éventuelles garanties financières du projet
                try {
                  const garantiesFinancières =
                    await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
                      type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
                      data: {
                        identifiantProjetValue,
                      },
                    });
                  if (garantiesFinancières) {
                    await mediator.send<GarantiesFinancières.EffacerHistoriqueGarantiesFinancièresUseCase>(
                      {
                        type: 'Lauréat.GarantiesFinancières.UseCase.EffacerHistoriqueGarantiesFinancières',
                        data: {
                          identifiantProjetValue,
                          effacéLeValue: dateActuelle.toISOString(),
                          effacéParValue: request.user.email,
                        },
                      },
                    );
                  }
                } catch (error) {}
              }
              // demander des garanties financières
              await mediator.send<GarantiesFinancières.DemanderGarantiesFinancièresUseCase>({
                type: 'Lauréat.GarantiesFinancières.UseCase.DemanderGarantiesFinancières',
                data: {
                  demandéLeValue: dateActuelle.toISOString(),
                  identifiantProjetValue,
                  dateLimiteSoumissionValue: new Date(
                    dateActuelle.setMonth(dateActuelle.getMonth() + 2),
                  ).toISOString(),
                  motifValue:
                    type === 'recours'
                      ? GarantiesFinancières.MotifDemandeGarantiesFinancières.recoursAccordé.motif
                      : GarantiesFinancières.MotifDemandeGarantiesFinancières.changementProducteur
                          .motif,
                },
              });
            }
          } catch (e) {
            logger.error(e);
            return errorResponse({ request, response });
          }
        }
        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Votre réponse a bien été enregistrée.',
            redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
            redirectTitle: 'Retourner à la demande',
          }),
        );
      }, _handleErrors(request, response, modificationRequestId));
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
