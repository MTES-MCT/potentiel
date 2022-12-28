import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { v1Router } from '../../v1Router'
import { vérifierPermissionUtilisateur } from '../../helpers'
import { InviterDgecValidateurPage } from '@views'
import { PermissionConsulterPageInvitationDgecValidateur } from '@modules/inviterDgecValidateur/permissions'

v1Router.get(
  routes.ADMIN_INVITATION_DGEC_VALIDATEUR,
  vérifierPermissionUtilisateur(PermissionConsulterPageInvitationDgecValidateur),
  asyncHandler(async (request, response) => response.send(InviterDgecValidateurPage({ request })))
)
