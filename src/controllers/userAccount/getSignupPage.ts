import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { v1Router } from '../v1Router'
import { SignupPage } from '@views'

v1Router.get(
  routes.SIGNUP,
  asyncHandler(async (request, response) => {
    return response.send(SignupPage({ request }))
  })
)
