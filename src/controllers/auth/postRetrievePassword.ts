import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { retrievePassword } from '../../useCases'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.post(
  routes.FORGOTTEN_PASSWORD_ACTION,
  asyncHandler(async (request, response) => {
    const { email } = request.body

    if (!email) {
      return response.redirect(
        addQueryParams(routes.FORGOTTEN_PASSWORD, {
          error: 'Merci de saisir une adresse email.',
        })
      )
    }
    ;(
      await retrievePassword({
        email: email.toLowerCase(),
      })
    ).match({
      ok: () =>
        response.redirect(
          addQueryParams(routes.FORGOTTEN_PASSWORD, {
            success:
              "Si l'adresse saisie correspond bien à un compte Potentiel, vous recevrez un courrier électronique avec des instructions pour choisir un nouveau mot de passe.",
          })
        ),
      err: (error: Error) =>
        response.redirect(
          addQueryParams(routes.FORGOTTEN_PASSWORD, {
            error: error.message,
          })
        ),
    })
  })
)
