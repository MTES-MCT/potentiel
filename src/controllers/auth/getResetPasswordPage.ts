import { passwordRetrievalRepo } from '../../dataAccess'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { ResetPasswordPage } from '../../views/pages'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

const ILLEGAL_RESET_CODE_ERROR = "Le lien de récupération de mot de passe n'est pas valable."

v1Router.get(
  routes.RESET_PASSWORD_LINK(),
  asyncHandler(async (request, response) => {
    const { resetCode } = request.query as any

    if (!resetCode) {
      return response.redirect(
        addQueryParams(routes.LOGIN, {
          error: ILLEGAL_RESET_CODE_ERROR,
        })
      )
    }

    // Check resetCode
    const passwordRetrievalResult = await passwordRetrievalRepo.findById(resetCode)

    if (passwordRetrievalResult.is_none()) {
      return response.redirect(
        addQueryParams(routes.LOGIN, {
          error: ILLEGAL_RESET_CODE_ERROR,
        })
      )
    }

    return response.send(
      ResetPasswordPage({
        request,
      })
    )
  })
)
