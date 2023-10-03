import fs from 'fs';
import * as yup from 'yup';

import {
  accorderDemandeAbandon,
  demanderConfirmationAbandon,
  ensureRole,
  getIdentifiantProjetByLegacyId,
  rejeterDemandeAbandon,
} from '../../../config';
import { logger } from '../../../core/utils';
import { UnauthorizedError } from '../../../modules/shared';

import { errorResponse, notFoundResponse, unauthorizedResponse } from '../../helpers';
import { addQueryParams } from '../../../helpers/addQueryParams';
import routes from '../../../routes';
import { upload } from '../../upload';
import { v1Router } from '../../v1Router';

import safeAsyncHandler from '../../helpers/safeAsyncHandler';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  convertirEnDateTime,
  convertirEnIdentifiantAppelOffre,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { FileReadableStream } from '../../../helpers/fileReadableStream';
import { isNone, none } from '@potentiel/monads';
import { RéponseAbandonAvecRecandidatureProps } from '../../../views/certificates/abandon/RéponseAbandonAvecRecandidature';
import { buildDocument } from '../../../views/certificates/abandon/buildDocument';
import { convertNodeJSReadableStreamToReadableStream } from '../../helpers/convertNodeJSReadableStreamToReadableStream';
import {
  ConsulterAbandonQuery,
  ConsulterAppelOffreQuery,
  ConsulterCandidatureLegacyQuery,
} from '@potentiel/domain-views';
import { format } from 'date-fns';

const schema = yup.object({
  body: yup.object({
    submitAccept: yup.string().nullable(),
    submitRefuse: yup.string().nullable(),
    submitConfirm: yup.string().nullable(),
    modificationRequestId: yup.string().uuid().required(),
    projectId: yup.string().uuid().required(),
  }),
});

v1Router.post(
  routes.ADMIN_REPONDRE_DEMANDE_ABANDON,
  ensureRole(['admin', 'dgec-validateur']),
  upload.single('file'),
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
      const {
        user,
        body: { modificationRequestId, projectId, submitAccept, submitRefuse, submitConfirm },
      } = request;

      const estAccordé = typeof submitAccept === 'string';
      const estRejeté = typeof submitRefuse === 'string';
      const estConfirmationDemandée = typeof submitConfirm === 'string';

      const identifiantProjet = await getIdentifiantProjetByLegacyId(projectId);
      if (!identifiantProjet) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      if (estAccordé) {
        let file:
          | {
              content: ReadableStream;
              contentForLegacy: NodeJS.ReadableStream;
              filename: string;
              mimeType: string;
            }
          | undefined;

        const abandon = await mediator.send<ConsulterAbandonQuery>({
          type: 'CONSULTER_ABANDON',
          data: {
            identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          },
        });

        if (isNone(abandon)) {
          return notFoundResponse({ request, response, ressourceTitle: `Demande d'abandon` });
        }

        if (abandon.demandeRecandidature) {
          const projet = await mediator.send<ConsulterCandidatureLegacyQuery>({
            type: 'CONSULTER_CANDIDATURE_LEGACY_QUERY',
            data: {
              identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
            },
          });

          if (isNone(projet)) {
            return notFoundResponse({ request, response, ressourceTitle: `Projet` });
          }

          const appelOffre = await mediator.send<ConsulterAppelOffreQuery>({
            type: 'CONSULTER_APPEL_OFFRE_QUERY',
            data: {
              identifiantAppelOffre: convertirEnIdentifiantAppelOffre(projet.appelOffre),
            },
          });

          if (isNone(appelOffre)) {
            return notFoundResponse({ request, response, ressourceTitle: `Appel offre` });
          }

          const période = appelOffre.periodes.find((p) => p.id === projet.période);

          if (!période) {
            return notFoundResponse({ request, response, ressourceTitle: `Période` });
          }

          const props: RéponseAbandonAvecRecandidatureProps = {
            dateCourrier: format(new Date(), 'dd/MM/yyyy'),
            projet: {
              potentielId: projet.potentielIdentifier,
              nomReprésentantLégal: projet.nomReprésentantLégal,
              nomCandidat: projet.nomCandidat,
              email: projet.email,
              nom: projet.nom,
              commune: projet.localité.commune,
              codePostal: projet.localité.codePostal,
              dateDésignation: format(new Date(projet.dateDésignation), 'dd/MM/yyyy'),
              puissance: projet.puissance,
            },
            appelOffre: {
              nom: appelOffre.shortTitle,
              description: appelOffre.title,
              période: période.title ?? projet.période,
              unitéPuissance: appelOffre.unitePuissance,
              texteEngagementRéalisationEtModalitésAbandon: appelOffre.donnéesCourriersRéponse
                .texteEngagementRéalisationEtModalitésAbandon ?? {
                référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
                dispositions: '!!!CONTENU NON DISPONIBLE!!!',
              },
            },
            demandeAbandon: {
              date: abandon.demandeDemandéLe,
              instructeur: {
                nom: 'DGEC',
                fonction: 'DGEC',
              },
            },
          };

          file = {
            content: await convertNodeJSReadableStreamToReadableStream(await buildDocument(props)),
            contentForLegacy: await buildDocument(props),
            filename: `${Date.now()}-réponse-abandon-avec-recandidature.pdf`,
            mimeType: 'application/pdf',
          };
        } else if (request.file) {
          file = {
            content: await convertNodeJSReadableStreamToReadableStream(
              fs.createReadStream(request.file.path),
            ),
            contentForLegacy: fs.createReadStream(request.file.path),
            filename: `${Date.now()}-${request.file.originalname}`,
            mimeType: request.file.mimetype,
          };
        }

        if (!file) {
          return errorResponse({
            request,
            response,
            customMessage:
              "La réponse n'a pas pu être envoyée car il manque le courrier de réponse (obligatoire pour cette réponse).",
          });
        }

        await mediator.send<DomainUseCase>({
          type: 'ACCORDER_ABANDON_USECASE',
          data: {
            identifiantProjet: convertirEnIdentifiantProjet({
              appelOffre: identifiantProjet.appelOffre || '',
              famille: identifiantProjet.famille || none,
              numéroCRE: identifiantProjet.numéroCRE || '',
              période: identifiantProjet.période || '',
            }),
            réponseSignée: {
              type: 'abandon-accordé',
              format: file.mimeType,
              content: file.content,
            },
            dateAccordAbandon: convertirEnDateTime(new Date()),
          },
        });

        accorderDemandeAbandon({
          user,
          demandeAbandonId: modificationRequestId,
          fichierRéponse: {
            contents: file.contentForLegacy,
            filename: file.filename,
          },
        }).match(
          () => {
            return response.redirect(
              routes.SUCCESS_OR_ERROR_PAGE({
                success: `La demande d'abandon a bien été accordée.`,
                redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
                redirectTitle: 'Retourner sur la demande',
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
                'Il y a eu une erreur lors de la soumission de votre accord. Merci de recommencer.',
            });
          },
        );
      }

      if (estRejeté) {
        if (!request.file) {
          return errorResponse({
            request,
            response,
            customMessage:
              "La réponse n'a pas pu être envoyée car il manque le courrier de réponse (obligatoire pour cette réponse).",
          });
        }

        const file = {
          contents: fs.createReadStream(request.file.path),
          filename: `${Date.now()}-${request.file.originalname}`,
        };

        await mediator.send<DomainUseCase>({
          type: 'REJETER_ABANDON_USECASE',
          data: {
            identifiantProjet: convertirEnIdentifiantProjet({
              appelOffre: identifiantProjet?.appelOffre || '',
              famille: identifiantProjet?.famille || none,
              numéroCRE: identifiantProjet?.numéroCRE || '',
              période: identifiantProjet?.période || '',
            }),
            réponseSignée: {
              type: 'abandon-rejeté',
              format: request.file.mimetype,
              content: new FileReadableStream(request.file.path),
            },
            dateRejetAbandon: convertirEnDateTime(new Date()),
          },
        });

        rejeterDemandeAbandon({
          user,
          demandeAbandonId: modificationRequestId,
          fichierRéponse: file,
        }).match(
          () => {
            return response.redirect(
              routes.SUCCESS_OR_ERROR_PAGE({
                success: `Le rejet de l'abandon a bien été prise en compte.`,
                redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
                redirectTitle: 'Retourner sur la page de la demande',
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
                'Il y a eu une erreur lors de la soumission de votre rejet. Merci de recommencer.',
            });
          },
        );
      }

      if (estConfirmationDemandée) {
        if (!request.file) {
          return errorResponse({
            request,
            response,
            customMessage:
              "La réponse n'a pas pu être envoyée car il manque le courrier de réponse (obligatoire pour cette réponse).",
          });
        }

        const file = {
          contents: fs.createReadStream(request.file.path),
          filename: `${Date.now()}-${request.file.originalname}`,
        };

        await mediator.send<DomainUseCase>({
          type: 'DEMANDER_CONFIRMATION_ABANDON_USECASE',
          data: {
            identifiantProjet: convertirEnIdentifiantProjet({
              appelOffre: identifiantProjet?.appelOffre || '',
              famille: identifiantProjet?.famille || none,
              numéroCRE: identifiantProjet?.numéroCRE || '',
              période: identifiantProjet?.période || '',
            }),
            réponseSignée: {
              type: 'abandon-à-confirmer',
              format: request.file.mimetype,
              content: new FileReadableStream(request.file.path),
            },
            dateDemandeConfirmationAbandon: convertirEnDateTime(new Date()),
          },
        });

        demanderConfirmationAbandon({
          user,
          demandeAbandonId: modificationRequestId,
          fichierRéponse: file,
        }).match(
          () => {
            return response.redirect(
              routes.SUCCESS_OR_ERROR_PAGE({
                success: `La demande de confirmation a bien été prise en compte.`,
                redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
                redirectTitle: 'Retourner sur la demande',
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
                'Il y a eu une erreur lors de la soumission de votre demande de confirmation. Merci de recommencer.',
            });
          },
        );
      }
    },
  ),
);

// v1Router.post(
//   routes.ADMIN_REPONDRE_DEMANDE_ABANDON,
//   ensureRole(['admin', 'dgec-validateur']),
//   upload.single('file'),
//   asyncHandler(async (request, response) => {
//     validateRequestBodyForErrorArray(request.body, requestBodySchema)
//       .asyncAndThen((body) => {
//         const { modificationRequestId, submitAccept, submitConfirm } = body;
//         const { user } = request;

//         if (!request.file) {
//           return errAsync(
//             new RequestValidationErrorArray([
//               "La réponse n'a pas pu être envoyée car il manque le courrier de réponse (obligatoire pour cette réponse).",
//             ]),
//           );
//         }

//         const file = request.file && {
//           contents: fs.createReadStream(request.file.path),
//           filename: `${Date.now()}-${request.file.originalname}`,
//         };

//         const estAccordé = typeof submitAccept === 'string';
//         const demanderConfirmation = typeof submitConfirm === 'string';

//         if (estAccordé) {
//           return accorderDemandeAbandon({
//             user,
//             demandeAbandonId: modificationRequestId,
//             fichierRéponse: file,
//           }).map(() => ({ modificationRequestId, action: 'accorder' }));
//         }

//         if (demanderConfirmation) {
//           return demanderConfirmationAbandon({
//             user,
//             demandeAbandonId: modificationRequestId,
//             fichierRéponse: file,
//           }).map(() => ({ modificationRequestId, action: 'demanderConfirmation' }));
//         }

//         return rejeterDemandeAbandon({
//           user,
//           demandeAbandonId: modificationRequestId,
//           fichierRéponse: file,
//         }).map(() => ({ modificationRequestId, action: 'rejeter' }));
//       })
//       .match(
//         ({ modificationRequestId, action }) => {
//           return response.redirect(
//             routes.SUCCESS_OR_ERROR_PAGE({
//               success: SUCCESS_MESSAGES[action],
//               redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
//               redirectTitle: 'Retourner sur la page de la demande',
//             }),
//           );
//         },
//         (error) => {
//           if (error instanceof AccorderDemandeAbandonError) {
//             return errorResponse({
//               request,
//               response,
//               customStatus: 400,
//               customMessage: error.message,
//             });
//           }
//           if (error instanceof UnauthorizedError) {
//             return unauthorizedResponse({ request, response });
//           }

//           if (error instanceof RequestValidationErrorArray) {
//             return response.redirect(
//               addQueryParams(routes.DEMANDE_PAGE_DETAILS(request.body.modificationRequestId), {
//                 error: `${error.message} ${error.errors.join(' ')}`,
//               }),
//             );
//           }

//           logger.error(error);
//           return errorResponse({
//             request,
//             response,
//             customMessage:
//               'Il y a eu une erreur lors de la soumission de votre réponse. Merci de recommencer.',
//           });
//         },
//       );
//   }),
// );
