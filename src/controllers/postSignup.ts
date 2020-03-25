import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { signup } from '../useCases'
import { User } from '../entities'

const postSignup = async (request: HttpRequest) => {
  // console.log('Call  to postSignup received', request.body)

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    projectAdmissionKey,
    projectId
  } = request.body

  const nonSecretUserInfo = {
    firstName,
    lastName,
    email,
    projectAdmissionKey,
    projectId
  }

  const userResult = await signup({
    ...nonSecretUserInfo,
    password,
    confirmPassword
  })

  return userResult.match({
    ok: (user: User) => {
      if (user === null) {
        return Redirect(ROUTES.SIGNUP, {
          ...nonSecretUserInfo,
          error: 'Erreur lors de la création de compte'
        })
      }

      return Redirect(
        ROUTES.USER_DASHBOARD,
        {
          success:
            'Votre compte a bien été créé, vous pouvez vous à présent vous identifier.'
        },
        user.id // This will log the user in
      )
    },
    err: (e: Error) => {
      console.log('postSignup error', e)
      return Redirect(ROUTES.SIGNUP, {
        ...nonSecretUserInfo,
        error: 'Erreur lors de la création de compte: ' + e.message
      })
    }
  })
}
export { postSignup }
