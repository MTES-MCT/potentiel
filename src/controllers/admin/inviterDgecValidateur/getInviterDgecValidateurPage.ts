import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { v1Router } from '../../v1Router'
import { vérifierPermissionUtilisateur } from '../../helpers'
import { InviterDgecValidateurPage } from '@views'
import { PermissionInviterDgecValidateur } from '@modules/utilisateur'
import { récupérerRésultatFormulaire } from '../../helpers/formulaires'

v1Router.get(
  routes.ADMIN_INVITATION_DGEC_VALIDATEUR,
  vérifierPermissionUtilisateur(PermissionInviterDgecValidateur),
  asyncHandler(async (request, response) => {
    return response.send(
      InviterDgecValidateurPage({
        request,
        résultatSoumissionFormulaire: récupérerRésultatFormulaire(
          request,
          routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION
        ),
      })
    )
  })
)
