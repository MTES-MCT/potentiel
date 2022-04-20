import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { v1Router } from '../v1Router'
import { createUser, userRepo } from '@config'
import { logger } from 'src/core/utils'
import { addQueryParams } from 'src/helpers/addQueryParams'

v1Router.post(
  routes.SIGNUP,
  asyncHandler(async (request, response) => {
    const { firstname, lastname, email } = request.body

    const validationErrors: Array<{ field: string; error: string }> = [
      ...(!firstname || !firstname.length
        ? [{ field: 'firstname', error: 'Ce champ est obligatoire' }]
        : []),
      ...(!lastname || !lastname.length
        ? [{ field: 'lastname', error: 'Ce champ est obligatoire' }]
        : []),
      ...(!email || !email.length
        ? [{ field: 'email', error: 'Ce champ est obligatoire' }]
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
      const res = await createUser({
        email,
        fullName: `${firstname} ${lastname}`,
        role: 'porteur-projet',
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
