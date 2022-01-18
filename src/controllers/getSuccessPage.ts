import asyncHandler from './helpers/asyncHandler'
import routes from '../routes'
import { SuccessPage } from '@views/legacy-pages'
import { v1Router } from './v1Router'

v1Router.get(
  routes.SUCCESS_OR_ERROR_PAGE(),
  asyncHandler(async (request, response) => {
    response.send(SuccessPage({ request }))
  })
)
