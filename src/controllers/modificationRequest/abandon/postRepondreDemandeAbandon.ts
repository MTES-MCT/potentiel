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

import { errorResponse, unauthorizedResponse } from '../../helpers';
import { addQueryParams } from '../../../helpers/addQueryParams';
import routes from '../../../routes';
import { upload } from '../../upload';
import { v1Router } from '../../v1Router';

import safeAsyncHandler from '../../helpers/safeAsyncHandler';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { FileReadableStream } from '../../../helpers/fileReadableStream';
import { none } from '@potentiel/monads';
import { RéponseAbandonAvecRecandidatureProps } from '../../../views/certificates/abandon/RéponseAbandonAvecRecandidature';
import { buildDocument } from '../../../views/certificates/abandon/buildDocument';
import { convertNodeJSReadableStreamToReadableStream } from '../../helpers/convertNodeJSReadableStreamToReadableStream';

const props: RéponseAbandonAvecRecandidatureProps = {
  dateCourrier: 'JJ/MM/AAAA',
  projet: {
    potentielId: 'Eolien - 1 - 12 8da8c',
    nomReprésentantLégal: 'Marcel Pagnol',
    nomCandidat: 'Lili des Bellons',
    email: 'marcel.pagnol@boulodrome-de-marseille.fr',
    nom: 'Le Boulodrome de Marseille',
    commune: 'Marseille',
    codePostal: '13000',
    dateDésignation: 'JJ/MM/AAAA',
    puissance: 13,
  },
  appelOffre: {
    nom: 'Eolien',
    description:
      'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie mécanique du vent implantées à terre',
    période: 'deuxième',
    unitéPuissance: 'MW',
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.3 et 6.6',
      dispositions: `Le Candidat dont l’offre a été retenue réalise l’Installation dans les conditions du présent cahier des charges et conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.4).

En cas de retrait de l’autorisation environnementale mentionnée au 3.3.3 par l’autorité compétente, d’annulation de cette autorisation à la suite d’un contentieux, ou, dans le cadre des première et troisième période, d’un rejet de sa demande pour cette même autorisation, le Candidat dont l’offre a été sélectionnée peut se désister. Il en fait la demande au ministre chargé de l’énergie sans délai et il est dans ce cas délié de ses obligations au titre du présent appel d’offres.`,
    },
  },
  demandeAbandon: {
    date: 'JJ/MM/AAAA',
    instructeur: {
      nom: 'Augustine Pagnol',
      fonction: 'DGEC',
    },
  },
};

const schema = yup.object({
  body: yup.object({
    submitAccept: yup.string().nullable(),
    submitRefuse: yup.string().nullable(),
    submitConfirm: yup.string().nullable(),
    modificationRequestId: yup.string().uuid().required(),
    projectId: yup.string().uuid().required(),
    recandidature: yup.boolean().optional(),
  }),
});

const SUCCESS_MESSAGES = {
  demanderConfirmation: 'La demande de confirmation a bien été prise en compte',
};

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
        modificationRequestId,
        projectId,
        submitAccept,
        submitRefuse,
        submitConfirm,
        recandidature,
      } = request.body;
      const { user } = request;

      const estAccordé = typeof submitAccept === 'string';
      const estRejeté = typeof submitRefuse === 'string';
      const estConfirmationDemandée = typeof submitConfirm === 'string';

      const identifiantProjet = await getIdentifiantProjetByLegacyId(projectId);

      if (estAccordé) {
        let file:
          | { content: NodeJS.ReadableStream; filename: string; mimeType: string }
          | undefined;

        if (recandidature) {
          file = {
            content: await buildDocument(props),
            filename: `${Date.now()}-réponse-abandon-avec-recandidature.pdf`,
            mimeType: 'application/pdf',
          };
        } else if (request.file) {
          file = {
            content: fs.createReadStream(request.file.path),
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
              appelOffre: identifiantProjet?.appelOffre || '',
              famille: identifiantProjet?.famille || none,
              numéroCRE: identifiantProjet?.numéroCRE || '',
              période: identifiantProjet?.période || '',
            }),
            réponseSignée: {
              type: 'abandon-accordé',
              format: file.mimeType,
              content: await convertNodeJSReadableStreamToReadableStream(file.content),
            },
            dateAccordAbandon: convertirEnDateTime(new Date()),
          },
        });

        accorderDemandeAbandon({
          user,
          demandeAbandonId: modificationRequestId,
          fichierRéponse: {
            contents: file.content,
            filename: file.filename,
          },
        }).match(
          () => {
            return response.redirect(
              routes.SUCCESS_OR_ERROR_PAGE({
                success: `La demande d'abandon a bien été accordée.`,
                redirectUrl: routes.GET_DEMANDER_ABANDON(projectId),
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
                success: `La demande d'abandon a bien été rejetée.`,
                redirectUrl: routes.GET_DEMANDER_ABANDON(projectId),
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
                redirectUrl: routes.GET_DEMANDER_ABANDON(projectId),
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
