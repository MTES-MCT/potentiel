import {
  ensureRole,
  choisirCahierDesCharges,
  renseignerIdentifiantGestionnaireRéseau,
} from '@config';
import { logger, okAsync } from '@core/utils';
import { UnauthorizedError } from '@modules/shared';
import routes from '@routes';
import { errorResponse, unauthorizedResponse } from '../helpers';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import {
  CahierDesChargesInitialNonDisponibleError,
  CahierDesChargesNonDisponibleError,
  IdentifiantGestionnaireRéseauExistantError,
  IdentifiantGestionnaireRéseauObligatoireError,
  NouveauCahierDesChargesDéjàSouscrit,
  PasDeChangementDeCDCPourCetAOError,
} from '@modules/project';
import { ModificationRequestType } from '@modules/modificationRequest';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import {
  CahierDesChargesRéférence,
  cahiersDesChargesRéférences,
  parseCahierDesChargesRéférence,
} from '@entities';

export type TypeDeModification = ModificationRequestType | 'delai';

const schema = yup.object({
  body: yup.object({
    projectId: yup.string().uuid().required(),
    redirectUrl: yup.string().required(),
    type: yup
      .mixed<TypeDeModification>()
      .oneOf([
        'actionnaire',
        'fournisseur',
        'producteur',
        'puissance',
        'recours',
        'abandon',
        'delai',
      ])
      .optional(),
    choixCDC: yup
      .mixed<CahierDesChargesRéférence>()
      .oneOf(cahiersDesChargesRéférences.slice())
      .required(),
    identifiantGestionnaireRéseau: yup.string().optional(),
    codeEICGestionnaireRéseau: yup.string().optional(),
  }),
});

const getRedirectTitle = (type: TypeDeModification) => {
  switch (type) {
    case 'delai':
    case 'recours':
      return `Retourner sur la demande de ${type}`;
    case 'abandon':
      return `Retourner sur la demande d'${type}`;
    case 'puissance':
    case 'fournisseur':
    case 'producteur':
      return `Retourner sur la demande de changement de ${type}`;
    default:
      return 'Retourner sur la page du projet';
  }
};

v1Router.post(
  routes.CHANGER_CDC,
  ensureRole('porteur-projet'),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        errorResponse({
          request,
          response,
          customMessage:
            'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
        }),
    },
    async (request, response) => {
      const {
        body: {
          projectId,
          redirectUrl,
          type,
          choixCDC,
          identifiantGestionnaireRéseau,
          codeEICGestionnaireRéseau,
        },
        user,
      } = request;

      return (() => {
        if (!identifiantGestionnaireRéseau) {
          return okAsync(null);
        }

        return renseignerIdentifiantGestionnaireRéseau({
          projetId: projectId,
          utilisateur: user,
          identifiantGestionnaireRéseau,
        });
      })()
        .andThen(() =>
          choisirCahierDesCharges({
            projetId: projectId,
            utilisateur: user,
            cahierDesCharges: parseCahierDesChargesRéférence(choixCDC),
          }),
        )
        .match(
          () => {
            return response.redirect(
              routes.SUCCESS_OR_ERROR_PAGE({
                success:
                  "Votre demande de changement de modalités d'instruction a bien été enregistrée.",
                redirectUrl,
                redirectTitle: getRedirectTitle(type),
              }),
            );
          },
          (error) => {
            if (error instanceof UnauthorizedError) {
              return unauthorizedResponse({ request, response });
            }

            if (
              error instanceof IdentifiantGestionnaireRéseauExistantError ||
              error instanceof IdentifiantGestionnaireRéseauObligatoireError ||
              error instanceof NouveauCahierDesChargesDéjàSouscrit ||
              error instanceof PasDeChangementDeCDCPourCetAOError ||
              error instanceof CahierDesChargesInitialNonDisponibleError ||
              error instanceof CahierDesChargesNonDisponibleError
            ) {
              return errorResponse({
                request,
                response,
                customMessage: error.message,
              });
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
