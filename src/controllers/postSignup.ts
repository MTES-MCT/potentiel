import { signup } from '../useCases'
import { Controller, HttpRequest } from '../types'
import ROUTES from '../routes'
import routes from '../routes'
import { ERREUR_FORMAT_LIGNE } from '../useCases/importProjects'

export default function makePostSignup(): Controller {
  return async (request: HttpRequest) => {
    console.log('Call to postSignup received', request.body)

    // TODO: pass the request body items to useCase
    // TODO: catch errors and redirect to signup page if any (try to populate fields?)

    const formContents = request.body

    try {
      await signup({
        firstName: formContents.firstName,
        lastName: formContents.lastName,
        email: formContents.email,
        password: formContents.password,
        confirmPassword: formContents.confirmPassword,
        projectAdmissionKey: formContents.projectAdmissionKey,
        projectId: formContents.projectId
      })
    } catch (e) {
      console.log('postSignup error', e)
      return {
        redirect: ROUTES.SIGNUP,
        query: { ...formContents, error: 'Signup failed' }
      }
    }

    // Log the user in

    return {
      redirect: ROUTES.LOGIN,
      query: {
        email: formContents.email,
        success:
          'Votre compte a bien été créé, vous pouvez vous à présent vous identifier.'
      }
    }
  }
}
