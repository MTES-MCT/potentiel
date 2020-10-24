import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { retrievePassword } from '../useCases'

const postRetrievePassword = async (request: HttpRequest) => {
  const { email } = request.body

  if (!email) {
    return Redirect(ROUTES.FORGOTTEN_PASSWORD, {
      error: 'Merci de saisir une adresse email.',
    })
  }
  const result = await retrievePassword({
    email,
  })
  return result.match({
    ok: () =>
      Redirect(ROUTES.FORGOTTEN_PASSWORD, {
        success:
          "Si l'adresse saisie correspond bien à un compte Potentiel, vous recevrez un courrier électronique avec des instructions pour choisir un nouveau mot de passe.",
      }),
    err: (error: Error) =>
      Redirect(ROUTES.FORGOTTEN_PASSWORD, {
        error: error.message,
      }),
  })
}
export { postRetrievePassword }
