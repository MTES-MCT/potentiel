import { addQueryParams } from '../../helpers/addQueryParams';
import routes from '@routes';
import { inviteUserToProject, ensureRole } from '@config';
import { v1Router } from '../v1Router';
import { errorResponse, unauthorizedResponse } from '../helpers';
import { UnauthorizedError } from '@modules/shared';
import { logger } from '@core/utils';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import * as yup from 'yup';
import { User } from '@entities';

const schema = yup.object({
  body: yup.object({
    email: yup.string().required().email(),
    projectId: yup.lazy((value) => {
      switch (typeof value) {
        case 'string':
          return yup.string().uuid().required();
        default:
          return yup.array().of(yup.string().uuid().required()).required();
      }
    }),
  }),
});

const getRedirectTo = ({ projectId }: { projectId: string | string[]; role: User['role'] }) => {
  return Array.isArray(projectId) ? routes.LISTE_PROJETS : routes.PROJECT_DETAILS(projectId);
};

v1Router.post(
  routes.INVITE_USER_TO_PROJECT_ACTION,
  ensureRole(['admin', 'dgec-validateur', 'dreal', 'porteur-projet']),
  safeAsyncHandler(
    {
      schema,
      onError: ({ response, request, error }) => {
        const projectId = request.body.projectId;
        const redirectTo = getRedirectTo({ projectId, role: request.user.role });
        return response.redirect(
          addQueryParams(redirectTo, {
            ...request.body,
            error: `${error.errors.join(' ')}`,
          }),
        );
      },
    },
    async (request, response) => {
      const { email, projectId } = request.body;
      const { user } = request;

      const projectIds = Array.isArray(projectId) ? projectId : [projectId];
      const redirectTo = getRedirectTo({ projectId, role: request.user.role });

      return await inviteUserToProject({
        email: email.toLowerCase(),
        projectIds,
        invitedBy: user,
      }).match(
        () =>
          response.redirect(
            addQueryParams(redirectTo, {
              success: 'Une invitation a bien été envoyée à ' + email,
            }),
          ),
        (error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ response, request });
          }

          logger.error(error);
          return errorResponse({ request, response });
        },
      );
    },
  ),
);
