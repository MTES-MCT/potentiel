import { Success } from '../helpers/responses'
import { HttpRequest } from '../types'
import { SignupPage } from '../views/pages'

const getSignupPage = async (request: HttpRequest) => {
  // console.log('Call to getSignupPage received', request.body, request.file)

  // Display the signup page
  return Success(
    SignupPage({
      request
    })
  )
}
export { getSignupPage }
