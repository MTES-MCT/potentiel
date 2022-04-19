import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { v1Router } from '../v1Router'
import { ResetPasswordPage } from '@views'

v1Router.get(
  routes.RESET_PASSWORD,
  asyncHandler(async (request, response) => {
    return response.send(ResetPasswordPage({ request }))
  })
)
