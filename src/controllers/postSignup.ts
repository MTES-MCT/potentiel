import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { signup } from '../useCases'
import user from '../entities/user'

const postSignup = async (request: HttpRequest) => {
  // console.log('Call  to postSignup received', request.body)

  // TODO: pass the request body items to useCase
  // TODO: catch errors and redirect to signup page if any (try to populate fields?)

  const formContents = request.body

  const userResult = await signup({
    firstName: formContents.firstName,
    lastName: formContents.lastName,
    email: formContents.email,
    password: formContents.password,
    confirmPassword: formContents.confirmPassword,
    projectAdmissionKey: formContents.projectAdmissionKey,
    projectId: formContents.projectId
  })

  if (userResult.is_err()) {
    console.log('postSignup error', userResult.unwrap_err())
    return Redirect(ROUTES.SIGNUP, {
      ...formContents,
      error: 'Erreur lors de la création de compte'
    })
  }

  const user = userResult.unwrap()

  if (user === null) {
    return Redirect(ROUTES.SIGNUP, {
      ...formContents,
      error: 'Erreur lors de la création de compte'
    })
  }

  return Redirect(
    ROUTES.USER_DASHBOARD,
    {
      success:
        'Votre compte a bien été créé, vous pouvez vous à présent vous identifier.'
    },
    user.id // This will login the user in
  )
}
export { postSignup }
