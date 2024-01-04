import asyncHandler from '../../helpers/asyncHandler';
import { v1Router } from '../../v1Router';
import { vérifierPermissionUtilisateur } from '../../helpers';
import { InviterDgecValidateurPage } from '../../../views';
import { PermissionInviterDgecValidateur } from '../../../modules/utilisateur';
import { getApiResult } from '../../helpers/apiResult';
import {
  GET_INVITER_DGEC_VALIDATEUR,
  POST_INVITER_DGEC_VALIDATEUR,
} from '@potentiel/legacy-routes';

v1Router.get(
  GET_INVITER_DGEC_VALIDATEUR,
  vérifierPermissionUtilisateur(PermissionInviterDgecValidateur),
  asyncHandler(async (request, response) => {
    const result = getApiResult(request, POST_INVITER_DGEC_VALIDATEUR);

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
