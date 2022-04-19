import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { v1Router } from '../v1Router'
import { addQueryParams } from 'src/helpers/addQueryParams'
import { sendResetPasswordEmail } from 'src/infra/keycloak/sendResetPasswordEmail'
import { logger } from 'src/core/utils'
import { getUserByEmail } from '@config'

v1Router.post(
  routes.RESET_PASSWORD,
  asyncHandler(async (request, response) => {
    const { email } = request.body

    if (!email || !email.length) {
      return response.redirect(
        addQueryParams(routes.RESET_PASSWORD, {
          error: 'Merci de renseigner votre adresse email.',
          ...request.body,
        })
      )
    }

    if (!email.match(/\S+@\S+\.\S+/)) {
      return response.redirect(
        addQueryParams(routes.RESET_PASSWORD, {
          error: "L'adresse email renseignée n'est pas valide.",
          ...request.body,
        })
      )
    }

    const userResult = await getUserByEmail(email)
    if (userResult.isErr() || userResult.value === null) {
      return response.redirect(
        addQueryParams(routes.RESET_PASSWORD, {
          error: `Impossible de retrouver un utilisateur avec cet email : ${email}.`,
          ...request.body,
        })
      )
    }

    try {
      const res = await sendResetPasswordEmail({
        email,
      })

      if (res.isErr()) {
        throw res.error
      }
    } catch (e) {
      logger.error(e)
      return response.redirect(
        addQueryParams(routes.RESET_PASSWORD, {
          error:
            "Impossible d'envoyer le lien de réinitialisation du mot de passe. Veuillez nous contacter si le problème persiste.",
          ...request.body,
        })
      )
    }

    return response.redirect(
      addQueryParams(routes.RESET_PASSWORD, {
        success: `Le lien de réinitialisation du mot de passe vous a bien été envoyé par mail à l\`adresse suivante : ${email}.`,
        ...request.body,
      })
    )
  })
)
