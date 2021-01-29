import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { resetPassword } from '../../useCases'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.post(
  routes.RESET_PASSWORD_ACTION,
  asyncHandler(async (request, response) => {
    const { password, confirmPassword, resetCode } = request.body

    ;(
      await resetPassword({
        password,
        confirmPassword,
        resetCode,
      })
    ).match({
      ok: () =>
        response.redirect(
          addQueryParams(routes.LOGIN, {
            success:
              'Votre mot de passe a bien été mis à jour. Vous pouvez à présenter vous identifier.',
          })
        ),
      err: (error: Error) =>
        response.redirect(
          addQueryParams(routes.RESET_PASSWORD_LINK({ resetCode }), {
            error: error.message,
          })
        ),
    })
  })
)
