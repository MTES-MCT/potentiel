import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { signup } from '../useCases'
import { User } from '../entities'

const postSignup = async (request: HttpRequest) => {
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

  const userResult = await signup({
    ...nonSecretUserInfo,
    password,
    confirmPassword,
  })

  return userResult.match({
    ok: (user: User) => {
      if (user === null) {
        return Redirect(ROUTES.SIGNUP, {
          ...nonSecretUserInfo,
          error: 'Erreur lors de la création de compte',
        })
      }

      return Redirect(
        user.role === 'dreal' ? ROUTES.GARANTIES_FINANCIERES_LIST : ROUTES.USER_DASHBOARD,
        {
          success:
            'Votre compte a bien été créé, vous pouvez vous à présent gérer vos projets ci-dessous.',
        },
        user.id // This will log the user in
      )
    },
    err: (e: Error) => {
      console.log('postSignup error', e)
      return Redirect(ROUTES.SIGNUP, {
        ...nonSecretUserInfo,
        error: 'Erreur lors de la création de compte: ' + e.message,
      })
    },
  })
}
export { postSignup }
