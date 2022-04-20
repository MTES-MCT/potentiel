import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { v1Router } from '../v1Router'
import { addQueryParams } from 'src/helpers/addQueryParams'
import { sendResetPasswordEmail } from 'src/infra/keycloak/sendResetPasswordEmail'
import { logger } from 'src/core/utils'
import { getUserByEmail } from '@config'
import * as yup from 'yup'
import { ValidationError } from 'yup'

const requestBodySchema = yup.object({
  email: yup
    .string()
    .required('Ce champ est obligatoire')
    .email(`L'adresse courriel renseignée n'est pas valide`),
})

v1Router.post(
  routes.RESET_PASSWORD,
  asyncHandler(async (request, response) => {
    try {
      requestBodySchema.validateSync(request.body, { abortEarly: false })
    } catch (error) {
      if (error instanceof ValidationError) {
        return response.redirect(
          addQueryParams(routes.RESET_PASSWORD, {
            ...request.body,
            ...error.inner.reduce(
              (errors, { path, message }) => ({ ...errors, [`error-${path}`]: message }),
              {}
            ),
          })
        )
      }
    }

    const { email } = request.body
    const userResult = await getUserByEmail(email)
    if (userResult.isErr() || userResult.value === null) {
      return response.redirect(
        addQueryParams(routes.RESET_PASSWORD, {
          error: `Impossible de retrouver un utilisateur avec cet email : ${email}.`,
          ...request.body,
        })
      )
    }

    const res = await sendResetPasswordEmail({
      email,
    })

    if (res.isErr()) {
      logger.error(res.error)
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
        success: `Le lien de réinitialisation du mot de passe vous a bien été envoyé par mail à l'adresse suivante : ${email}.`,
        ...request.body,
      })
    )
  })
)
