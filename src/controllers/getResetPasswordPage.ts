import { Success, Redirect } from '../helpers/responses'
import { HttpRequest } from '../types'
import { ResetPasswordPage } from '../views/pages'
import { passwordRetrievalRepo } from '../dataAccess'
import routes from '../routes'

const ILLEGAL_RESET_CODE_ERROR =
  "Le lien de récupération de mot de passe n'est pas valable."

const getResetPasswordPage = async (request: HttpRequest) => {
  // console.log('Call to getResetPasswordPage received', request.query)

  const { resetCode } = request.query

  if (!resetCode) {
    return Redirect(routes.LOGIN, {
      error: ILLEGAL_RESET_CODE_ERROR,
    })
  }

  // Check resetCode
  const passwordRetrievalResult = await passwordRetrievalRepo.findById(
    resetCode
  )

  if (passwordRetrievalResult.is_none()) {
    return Redirect(routes.LOGIN, {
      error: ILLEGAL_RESET_CODE_ERROR,
    })
  }

  return Success(
    ResetPasswordPage({
      request,
    })
  )
}
export { getResetPasswordPage }
