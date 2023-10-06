import asyncHandler from '../../helpers/asyncHandler';
import routes from '../../../routes';
import { v1Router } from '../../v1Router';
import { vérifierPermissionUtilisateur } from '../../helpers';
import { InviterAdministrateurPage } from '../../../views';
import { PermissionInviterAdministrateur } from '../../../modules/utilisateur';

v1Router.get(
  routes.GET_INVITER_UTILISATEUR_ADMINISTRATEUR_PAGE,
  vérifierPermissionUtilisateur(PermissionInviterAdministrateur),
  asyncHandler(async (request, response) => {
    const { query } = request;
    const validationErrors: Array<{ [fieldName: string]: string }> = Object.entries(query).reduce(
      (errors, [key, value]) => ({
        ...errors,
        ...(key.startsWith('error-') && { [key.replace('error-', '')]: value }),
      }),
      [] as Array<{ [fieldName: string]: string }>,
    );

    return response.send(
      InviterAdministrateurPage({
        request,
        validationErrors,
      }),
    );
  }),
);
