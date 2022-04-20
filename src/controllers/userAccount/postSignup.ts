import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { v1Router } from '../v1Router'
import { createUser } from '@config'
import { logger } from 'src/core/utils'
import { addQueryParams } from 'src/helpers/addQueryParams'
import * as yup from 'yup'
import { ValidationError } from 'yup'

const requestBodySchema = yup.object({
  firstname: yup.string().required('Ce champ est obligatoire'),
  lastname: yup.string().required('Ce champ est obligatoire'),
  email: yup
    .string()
    .required('Ce champ est obligatoire')
    .email(`L'adresse courriel renseignée n'est pas valide`),
})

v1Router.post(
  routes.SIGNUP,
  asyncHandler(async (request, response) => {
    try {
      requestBodySchema.validateSync(request.body, { abortEarly: false })
    } catch (error) {
      if (error instanceof ValidationError) {
        return response.redirect(
          addQueryParams(routes.SIGNUP, {
            ...request.body,
            ...error.inner.reduce(
              (errors, { path, message }) => ({ ...errors, [`error-${path}`]: message }),
              {}
            ),
          })
        )
      }
    }

    const { firstname, lastname, email } = request.body
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
