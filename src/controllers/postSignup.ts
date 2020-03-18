import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { signup } from '../useCases'

const postSignup = async (request: HttpRequest) => {
  // console.log('Call  to postSignup received', request.body)

  // TODO: pass the request body items to useCase
  // TODO: catch errors and redirect to signup page if any (try to populate fields?)

  const formContents = request.body

  try {
    const userId = await signup({
      firstName: formContents.firstName,
      lastName: formContents.lastName,
      email: formContents.email,
      password: formContents.password,
      confirmPassword: formContents.confirmPassword,
      projectAdmissionKey: formContents.projectAdmissionKey,
      projectId: formContents.projectId
    })

    return {
      redirect: ROUTES.USER_DASHBOARD,
      user: { id: userId }, // This will login the user in
      query: {
        success:
          'Votre compte a bien été créé, vous pouvez vous à présent vous identifier.'
      }
    }
  } catch (e) {
    console.log('postSignup error', e)
    return {
      redirect: ROUTES.SIGNUP,
      query: {
        ...formContents,
        error: 'Erreur lors de la création de compte'
      }
    }
  }
}
export { postSignup }
