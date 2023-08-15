import asyncHandler from '../../helpers/asyncHandler';
import routes from '../../../routes';
import { v1Router } from '../../v1Router';
import { vérifierPermissionUtilisateur } from '../../helpers';
import { InviterDgecValidateurPage } from '../../../views';
import { PermissionInviterDgecValidateur } from '../../../modules/utilisateur';
import { getApiResult } from '../../helpers/apiResult';

v1Router.get(
  routes.ADMIN_INVITATION_DGEC_VALIDATEUR,
  vérifierPermissionUtilisateur(PermissionInviterDgecValidateur),
  asyncHandler(async (request, response) => {
    const result = getApiResult(request, routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION);

    return response.send(
      InviterDgecValidateurPage({
        request,
        inviationRéussi: result?.status === 'OK' ? true : undefined,
        formErrors:
          result?.status === 'BAD_REQUEST'
            ? (result.formErrors as Record<string, string>)
            : undefined,
      }),
    );
  }),
);
