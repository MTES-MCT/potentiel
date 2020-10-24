import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { resetPassword } from '../useCases'

const postResetPassword = async (request: HttpRequest) => {
  const { password, confirmPassword, resetCode } = request.body

  const result = await resetPassword({
    password,
    confirmPassword,
    resetCode,
  })
  return result.match({
    ok: () =>
      Redirect(ROUTES.LOGIN, {
        success:
          'Votre mot de passe a bien été mis à jour. Vous pouvez à présenter vous identifier.',
      }),
    err: (error: Error) =>
      Redirect(ROUTES.RESET_PASSWORD_LINK({ resetCode }), {
        error: error.message,
      }),
  })
}
export { postResetPassword }
