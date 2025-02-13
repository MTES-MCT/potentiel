import fs from 'fs';
import omit from 'lodash/omit';
import * as yup from 'yup';

import { Option } from '@potentiel-libraries/monads';
import { ensureRole, changerProducteur } from '../../../config';
import { logger } from '../../../core/utils';
import { UnauthorizedError } from '../../../modules/shared';
import routes from '../../../routes';

import { addQueryParams } from '../../../helpers/addQueryParams';
import {
  errorResponse,
  isSoumisAuxGF,
  notFoundResponse,
  unauthorizedResponse,
} from '../../helpers';
import { upload } from '../../upload';
import { v1Router } from '../../v1Router';
import { ChangementProducteurImpossiblePourEolienError } from '../../../modules/project/errors';
import { NouveauCahierDesChargesNonChoisiError } from '../../../modules/demandeModification';
import safeAsyncHandler from '../../helpers/safeAsyncHandler';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Project } from '../../../infra/sequelize';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { mediator } from 'mediateur';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

const schema = yup.object({
  body: yup.object({
    projetId: yup.string().uuid().required(),
    producteur: yup.string().required('Le champ "nouveau producteur" est obligatoire.'),
    justification: yup.string().optional(),
  }),
});

v1Router.post(
  routes.POST_CHANGER_PRODUCTEUR,
  upload.single('file', (request, response, error) =>
    response.redirect(
      addQueryParams(routes.GET_CHANGER_PRODUCTEUR(request.body.projetId), {
        ...omit(request.body, 'projectId'),
        error,
      }),
    ),
  ),
  ensureRole('porteur-projet'),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) => {
        return response.redirect(
          addQueryParams(routes.GET_CHANGER_PRODUCTEUR(request.body.projetId), {
            ...omit(request.body, 'projectId'),
            error: `${error.errors.join(' ')}`,
          }),
        );
      },
    },
    async (request, response) => {
      const { user } = request;
      const { projetId, justification, producteur } = request.body;

      const fichier = request.file && {
        contents: fs.createReadStream(request.file.path),
        filename: `${Date.now()}-${request.file.originalname}`,
      };

      try {
        await changerProducteur({
          porteur: user,
          projetId,
          ...(fichier && { fichier }),
          ...(justification && { justification }),
          nouveauProducteur: producteur,
        });

        const projet = await Project.findByPk(projetId);
        if (!projet) {
          return notFoundResponse({ request, response });
        }
        const identifiantProjetValue = IdentifiantProjet.convertirEnValueType(
          `${projet.appelOffreId}#${projet.periodeId}#${projet.familleId}#${projet.numeroCRE}`,
        ).formatter();

        const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
          type: 'AppelOffre.Query.ConsulterAppelOffre',
          data: { identifiantAppelOffre: projet.appelOffreId },
        });

        if (Option.isNone(appelOffre)) {
          return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
        }

        if (
          isSoumisAuxGF({
            appelOffres: appelOffre,
            famille: projet.familleId,
            période: projet.periodeId,
          })
        ) {
          const dateActuelle = DateTime.now().date;

          const garantiesFinancières =
            await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
              type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
              data: {
                identifiantProjetValue,
              },
            });

          if (Option.isSome(garantiesFinancières)) {
            await mediator.send<GarantiesFinancières.EffacerHistoriqueGarantiesFinancièresUseCase>({
              type: 'Lauréat.GarantiesFinancières.UseCase.EffacerHistoriqueGarantiesFinancières',
              data: {
                identifiantProjetValue,
                effacéLeValue: dateActuelle.toISOString(),
                effacéParValue: user.email,
              },
            });
          }

          await mediator.send<GarantiesFinancières.DemanderGarantiesFinancièresUseCase>({
            type: 'Lauréat.GarantiesFinancières.UseCase.DemanderGarantiesFinancières',
            data: {
              demandéLeValue: dateActuelle.toISOString(),
              identifiantProjetValue,
              dateLimiteSoumissionValue: new Date(
                dateActuelle.setMonth(dateActuelle.getMonth() + 2),
              ).toISOString(),
              motifValue:
                GarantiesFinancières.MotifDemandeGarantiesFinancières.changementProducteur.motif,
            },
          });
        }

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: `Votre changement de producteur a bien été enregistré. Vous n'avez plus accès au projet sur Potentiel.`,
            redirectUrl: routes.LISTE_PROJETS,
            redirectTitle: 'Retourner à la liste des mes projets',
          }),
        );
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          return unauthorizedResponse({ request, response });
        }

        if (
          error instanceof ChangementProducteurImpossiblePourEolienError ||
          error instanceof NouveauCahierDesChargesNonChoisiError
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
      }
    },
  ),
);
