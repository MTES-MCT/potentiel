import asyncHandler from './helpers/asyncHandler';
import routes from '../routes';
import { v1Router } from './v1Router';

v1Router.get(
  routes.LOGOUT_ACTION,
  asyncHandler(async (request, response) => {
    response.redirect(process.env.NEXT_APP_ACTIVATED === 'true' ? '/auth/signOut' : '/logout');
  }),
);
