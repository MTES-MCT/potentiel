import { relanceInvitation } from '@config'
import asyncHandler from '../helpers/asyncHandler'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'

v1Router.post(
  routes.ADMIN_INVITATION_RELANCE_ACTION,
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    const { email } = request.body

    const redirectTo = routes.ADMIN_INVITATION_LIST

    await relanceInvitation({ email, relanceBy: request.user }).match(
      () => {
        return response.redirect(
          addQueryParams(redirectTo, {
            success: `Une invitation a bien été renvoyée à ${email}.`,
          })
        )
      },
      (e) => {
        return response.redirect(
          addQueryParams(redirectTo, {
            error:
              "L'invitation n'a pas pu être relancée pour une raison technique. Merci de réessayer.",
          })
        )
      }
    )
  })
)
