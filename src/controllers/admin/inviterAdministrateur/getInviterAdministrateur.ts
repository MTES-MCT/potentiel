import asyncHandler from '../../helpers/asyncHandler';
import { v1Router } from '../../v1Router';
import { vérifierPermissionUtilisateur } from '../../helpers';
import { InviterAdministrateurPage } from '../../../views';
import { PermissionInviterAdministrateur } from '../../../modules/utilisateur';
import { GET_INVITER_ADMINISTRATEUR } from '@potentiel/legacy-routes';

v1Router.get(
  GET_INVITER_ADMINISTRATEUR,
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
