import { promisify } from 'util'
import { logger } from '../../core/utils'
import { User } from '../../entities'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { signup } from '../../useCases'
import { v1Router } from '../v1Router'

v1Router.post(routes.SIGNUP_ACTION, async (request, response) => {
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
      await promisify(request.login)(user)

      return response.redirect(
        addQueryParams(
          user.role === 'dreal' ? routes.GARANTIES_FINANCIERES_LIST : routes.USER_DASHBOARD,
          {
            success:
              'Votre compte a bien été créé, vous pouvez vous à présent gérer vos projets ci-dessous.',
          }
        )
      )
    },
    err: async (e: Error) => {
      logger.error(e)
      return response.redirect(
        addQueryParams(routes.SIGNUP, {
          ...nonSecretUserInfo,
          error: 'Erreur lors de la création de compte: ' + e.message,
        })
      )
    },
  })
})
