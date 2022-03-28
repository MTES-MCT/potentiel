import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { v1Router } from '../v1Router'
import { HomePage } from '@views'

v1Router.get(
  routes.HOME,
  asyncHandler(async (request, response) => {
    response.send(
      HomePage({
        request,
      })
    )
  })
)
