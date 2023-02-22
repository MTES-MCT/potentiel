import { UniqueEntityID } from '@core/domain';
import { logger } from '@core/utils';
import { toProjectDataForCertificate, ProjectProps } from '@modules/project';
import { IncompleteDataError } from '@modules/shared';
import routes from '@routes';
import { v1Router } from '../v1Router';
import { ensureRole } from '@config';
import { getUserProject } from '@useCases';
import { buildCertificate } from '@views/certificates';
import { errorResponse, notFoundResponse } from '../helpers';
import { isNotifiedPeriode } from '@entities';
import { userIs } from '@modules/users';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import * as yup from 'yup';

const schema = yup.object({
  params: yup.object({
    projectId: yup.string().uuid().required(),
  }),
});

v1Router.get(
  routes.PREVIEW_CANDIDATE_CERTIFICATE(),
  ensureRole(['admin', 'dgec-validateur']),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const { projectId } = request.params;
      const { user } = request;

      // Verify that the current user has the rights to check this out
      const project = await getUserProject({ user, projectId });

      if (!project) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const periode = project.appelOffre?.periode;

      if (!periode || !isNotifiedPeriode(periode) || !periode.certificateTemplate) {
        logger.error(new Error("Impossible de trouver le modèle d'attestation pour ce projet"));
        return errorResponse({
          request,
          response,
          customMessage: "Impossible de trouver le modèle d'attestation pour ce projet",
        });
      }

      const { certificateTemplate } = periode;

      await toProjectDataForCertificate({
        appelOffre: project.appelOffre,
        isClasse: project.classe === 'Classé',
        notifiedOn: Date.now(),
        projectId: new UniqueEntityID(project.id),
        data: project as unknown,
        potentielIdentifier: project.potentielIdentifier,
      } as ProjectProps)
        .asyncAndThen((data) =>
          buildCertificate({
            template: certificateTemplate,
            data,
            validateur: userIs('dgec-validateur')(user)
              ? {
                  fullName: user.fullName,
                  fonction: user.fonction ?? undefined,
                }
              : {
                  fullName: '[Nom du signataire]',
                  fonction: '[Intitulé de la fonction du signataire]',
                },
          }),
        )
        .match(
          (certificateStream) => {
            response.type('pdf');
            certificateStream.pipe(response);
            return response.status(200);
          },
          (e: Error) => {
            logger.error(e);

            if (e instanceof IncompleteDataError) {
              return errorResponse({
                request,
                response,
                customStatus: 400,
                customMessage: "Impossible de générer l'attestion parce qu'il manque des données.",
              });
            } else {
              return errorResponse({
                request,
                response,
              });
            }
          },
        );
    },
  ),
);
