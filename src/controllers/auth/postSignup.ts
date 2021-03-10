import { logger } from '../../core/utils'
import { User } from '../../entities'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { signup } from '../../useCases'
import { SYSTEM_ERROR } from '../../useCases/signup'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.post(
  routes.SIGNUP_ACTION,
  asyncHandler(async (request, response) => {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      projectAdmissionKey,
      projectId,
    } = request.body

    const nonSecretUserInfo = {
      fullName,
      email,
      projectAdmissionKey,
      projectId,
    }

    ;(
      await signup({
        ...nonSecretUserInfo,
        password,
        confirmPassword,
      })
    ).match({
      ok: async (user: User) => {
        if (user === null) {
          return response.redirect(
            addQueryParams(routes.SIGNUP, {
              ...nonSecretUserInfo,
              error: 'Erreur lors de la création de compte',
            })
          )
        }

        // Auto-log the user in
        request.login(user, (err) => {
          if (err) {
            logger.error(err)
          }

          response.redirect(
            addQueryParams(user.role === 'dreal' ? routes.ADMIN_DASHBOARD : routes.USER_DASHBOARD, {
              success:
                'Votre compte a bien été créé, vous pouvez vous à présent gérer vos projets ci-dessous.',
            })
          )
        })
      },
      err: async (e: Error) => {
        if (e.message === SYSTEM_ERROR) logger.error(e)
        return response.redirect(
          addQueryParams(routes.SIGNUP, {
            ...nonSecretUserInfo,
            error: 'Erreur lors de la création de compte: ' + e.message,
          })
        )
      },
    })
  })
)
