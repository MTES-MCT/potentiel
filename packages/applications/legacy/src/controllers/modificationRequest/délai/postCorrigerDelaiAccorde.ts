import fs from 'fs';
import * as yup from 'yup';

import { corrigerDélaiAccordé, ensureRole, getIdentifiantProjetByLegacyId } from '../../../config';
import routes from '../../../routes';

import { addQueryParams } from '../../../helpers/addQueryParams';
import {
  errorResponse,
  iso8601DateToDateYupTransformation,
  notFoundResponse,
  unauthorizedResponse,
} from '../../helpers';
import { upload } from '../../upload';
import { v1Router } from '../../v1Router';
import safeAsyncHandler from '../../helpers/safeAsyncHandler';
import { validateUniqueId } from '../../../helpers/validateUniqueId';
import { UnauthorizedError } from '../../../modules/shared';
import { logger } from '../../../core/utils';
import { DomainError } from '../../../core/domain';
import { mediator } from 'mediateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';
import { getDelaiDeRealisation } from '../../../modules/projectAppelOffre';
import { add, sub } from 'date-fns';
import { ModificationRequest } from '../../../infra/sequelize/projectionsNext';
import { Option } from '@potentiel-libraries/monads';

const schema = yup.object({
  body: yup.object({
    demandeDelaiId: yup.string().uuid().required(),
    dateAchevementAccordee: yup
      .date()
      .required(`Vous devez renseigner la date limite d'achèvement à appliquer.`)
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date limite d'achèvement saisie n'est pas valide.`),
    explications: yup.string().optional(),
  }),
});

v1Router.post(
  routes.POST_CORRIGER_DELAI_ACCORDE,
  upload.single('file', (request, response, error) =>
    response.redirect(
      addQueryParams(routes.GET_CORRIGER_DELAI_ACCORDE_PAGE(request.body.demandeDelaiId), {
        error,
      }),
    ),
  ),
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) => {
        return response.redirect(
          addQueryParams(routes.GET_CORRIGER_DELAI_ACCORDE_PAGE(request.body.demandeDelaiId), {
            error: `${error.errors.join(' ')}`,
          }),
        );
      },
    },
    async (request, response) => {
      const {
        dateAchevementAccordee: dateAchèvementAccordée,
        demandeDelaiId: demandeDélaiId,
        explications,
      } = request.body;
      const { user } = request;

      if (!user) {
        return notFoundResponse({ request, response, ressourceTitle: 'Utilisateur' });
      }

      if (!validateUniqueId(demandeDélaiId)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
      }

      if (!request.file) {
        return response.redirect(
          addQueryParams(routes.GET_CORRIGER_DELAI_ACCORDE_PAGE(demandeDélaiId), {
            error: `Vous devez joindre un nouveau courrier de réponse.`,
          }),
        );
      }

      const fichierRéponse = request.file && {
        contents: fs.createReadStream(request.file.path),
        filename: `${Date.now()}-${request.file.originalname}`,
      };

      const projectLegacyId = await _getProjectId(demandeDélaiId);
      if (!projectLegacyId) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const identifiantProjet = await getIdentifiantProjetByLegacyId(projectLegacyId);
      if (!identifiantProjet) {
        return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
      }

      const résuméProjet = await mediator.send<Candidature.ConsulterProjetQuery>({
        type: 'Candidature.Query.ConsulterProjet',
        data: { identifiantProjet: identifiantProjet.identifiantProjetValue },
      });

      if (Option.isNone(résuméProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
      }

      const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: { identifiantAppelOffre: résuméProjet.appelOffre },
      });

      if (Option.isNone(appelOffre)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
      }

      const delaiRealisationEnMois = getDelaiDeRealisation(appelOffre, résuméProjet.technologie);
      if (!delaiRealisationEnMois) {
        return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
      }

      const dateAchèvementProjetInitiale = sub(
        add(new Date(résuméProjet.dateDésignation), {
          months: delaiRealisationEnMois,
        }),
        {
          days: 1,
        },
      );

      await corrigerDélaiAccordé({
        dateAchèvementAccordée,
        demandeDélaiId,
        explications,
        fichierRéponse,
        user,
        dateAchèvementProjetInitiale,
        projectLegacyId,
      }).match(
        () => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: `Le délai accordé a bien été corrigé.`,
              redirectUrl: routes.GET_DETAILS_DEMANDE_DELAI_PAGE(demandeDélaiId),
              redirectTitle: 'Retourner sur la page de la demande',
            }),
          );
        },
        (error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response });
          }

          if (error instanceof DomainError) {
            return response.redirect(
              addQueryParams(routes.GET_CORRIGER_DELAI_ACCORDE_PAGE(request.body.demandeDelaiId), {
                error: error.message,
              }),
            );
          }

          logger.error(error);
          return errorResponse({ request, response });
        },
      );
    },
  ),
);

const _getProjectId = async (modificationRequestId) => {
  const rawModificationRequest = await ModificationRequest.findOne({
    where: {
      id: modificationRequestId,
    },
    attributes: ['projectId'],
  });

  return rawModificationRequest?.projectId;
};
