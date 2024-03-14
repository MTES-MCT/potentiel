import asyncHandler from './helpers/asyncHandler';
import routes from '../routes';
import { v1Router } from './v1Router';
import { SuccèsOuErreurPage } from '../views';

v1Router.get(
  routes.SUCCESS_OR_ERROR_PAGE(),
  asyncHandler(async (request, response) => {
    response.send(SuccèsOuErreurPage({ request }));
  }),
);
