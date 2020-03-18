import { HttpRequest } from '../types'
import { SignupPage } from '../views/pages'

const getSignupPage = async (request: HttpRequest) => {
  // console.log('Call to getSignupPage received', request.body, request.file)

  // Display the signup page
  return {
    statusCode: 200,
    body: SignupPage({
      error: request.query.error,
      projectAdmissionKey: request.query.key,
      projectId: request.query.project
    })
  }
}
export { getSignupPage }
