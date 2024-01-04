import { getPendingCandidateInvitations, ensureRole } from '../../config';
import asyncHandler from '../helpers/asyncHandler';
import { addQueryParams } from '../../helpers/addQueryParams';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { InvitationsCandidatsEnAttentePage } from '../../views';
import { getCurrentUrl, getPagination } from '../helpers';

import { GET_LISTE_PROJETS } from '@potentiel/legacy-routes';

v1Router.get(
  routes.ADMIN_INVITATION_LIST,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    const pagination = getPagination(request);

    await getPendingCandidateInvitations(pagination).match(
      (invitations) => {
        return response.send(
          InvitationsCandidatsEnAttentePage({
            request,
            invitations,
            currentUrl: getCurrentUrl(request),
          }),
        );
      },
      () => {
        return response.redirect(
          addQueryParams(GET_LISTE_PROJETS, {
            error: "La liste des invitations en attente n'a pas pu être générée.",
          }),
        );
      },
    );
  }),
);
