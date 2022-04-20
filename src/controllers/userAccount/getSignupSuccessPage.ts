import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { v1Router } from '../v1Router'
import { SignupSuccessPage } from '@views'

v1Router.get(
  routes.SIGNUP_SUCCESS,
  asyncHandler(async (request, response) => {
    return response.send(SignupSuccessPage({ request }))
  })
)
