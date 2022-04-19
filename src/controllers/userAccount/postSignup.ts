import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { v1Router } from '../v1Router'
import { errorResponse } from '../helpers'
import { userRepo } from '@config'
import { logger } from 'src/core/utils'
import { addQueryParams } from 'src/helpers/addQueryParams'

v1Router.post(
  routes.SIGNUP,
  asyncHandler(async (request, response) => {
    const { firstname, lastname, email } = request.body

    if (!firstname || !firstname.length) {
      return response.redirect(
        addQueryParams(routes.SIGNUP, {
          error: 'Merci de renseigner votre prénom.',
          ...request.body,
        })
      )
    }

    if (!lastname || !lastname.length) {
      return response.redirect(
        addQueryParams(routes.SIGNUP, {
          error: 'Merci de renseigner votre nom.',
          ...request.body,
        })
      )
    }

    const fullName = firstname + lastname

    if (!email || !email.length) {
      return response.redirect(
        addQueryParams(routes.SIGNUP, {
          error: 'Merci de renseigner votre adresse email.',
          ...request.body,
        })
      )
    }

    if (!email.match(/\S+@\S+\.\S+/)) {
      return response.redirect(
        addQueryParams(routes.SIGNUP, {
          error: "L'adresse email renseignée n'est pas valide.",
          ...request.body,
        })
      )
    }

    try {
      const res = await userRepo.transaction(email, (user) => {
        return user.create({ fullName, role: 'porteur-projet' })
      })

      if (res.isErr()) {
        throw res.error
      }
    } catch (e) {
      logger.error(e)
      return errorResponse({
        response,
        request,
        customMessage:
          'Impossible de créer le compte utilisateur. Veuillez nous contacter si le problème persiste.',
      })
    }
    return response.redirect(
      addQueryParams(routes.SIGNUP, {
        success: 'Votre compte utilisateur a bien été créé.',
        ...request.body,
      })
    )
  })
)
