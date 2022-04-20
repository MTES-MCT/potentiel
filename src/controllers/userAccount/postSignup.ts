import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { v1Router } from '../v1Router'
import { userRepo } from '@config'
import { logger } from 'src/core/utils'
import { addQueryParams } from 'src/helpers/addQueryParams'

v1Router.post(
  routes.SIGNUP,
  asyncHandler(async (request, response) => {
    const { firstname, lastname, email } = request.body

    const validationErrors: Array<{ field: string; error: string }> = [
      ...(!firstname || !firstname.length
        ? [{ field: 'firstname', error: 'Merci de renseigner votre prénom' }]
        : []),
      ...(!lastname || !lastname.length
        ? [{ field: 'lastname', error: 'Merci de renseigner votre nom' }]
        : []),
      ...(!email || !email.length
        ? [{ field: 'email', error: 'Merci de renseigner votre adresse email' }]
        : !email.match(/\S+@\S+\.\S+/)
        ? [
            {
              field: 'email',
              error: `L'adresse courriel renseignée n'est pas valide`,
            },
          ]
        : []),
    ]

    if (validationErrors.length > 0) {
      return response.redirect(
        addQueryParams(routes.SIGNUP, {
          ...request.body,
          ...validationErrors.reduce(
            (errors, { field, error }) => ({ ...errors, [`error-${field}`]: error }),
            {}
          ),
        })
      )
    }

    try {
      const res = await userRepo.transaction(email, (user) => {
        return user.create({ fullName: `${firstname} ${lastname}`, role: 'porteur-projet' })
      })

      if (res.isErr()) {
        throw res.error
      }
    } catch (e) {
      logger.error(e)
      return response.redirect(
        addQueryParams(routes.SIGNUP, {
          error:
            'Impossible de créer le compte utilisateur. Veuillez tester de nouveau et nous contacter si le problème persiste.',
          ...request.body,
        })
      )
    }
    return response.redirect(
      addQueryParams(routes.SIGNUP, {
        success: 'Votre compte utilisateur a bien été créé.',
        ...request.body,
      })
    )
  })
)
