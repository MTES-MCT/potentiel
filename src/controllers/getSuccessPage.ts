import asyncHandler from 'express-async-handler'
import routes from '../routes'
import { SuccessPage } from '../views/legacy-pages'
import { v1Router } from './v1Router'

v1Router.get(
  routes.SUCCESS_PAGE(),
  asyncHandler(async (request, response) => {
    response.send(SuccessPage({ request }))
  })
)
