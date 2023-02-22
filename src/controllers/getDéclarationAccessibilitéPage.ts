import asyncHandler from './helpers/asyncHandler';
import routes from '@routes';
import { v1Router } from './v1Router';
import { DéclarationAccessibilitéPage } from '@views';

v1Router.get(
  routes.DECLARATION_ACCESSIBILITE,
  asyncHandler(async (request, response) => {
    response.send(
      DéclarationAccessibilitéPage({
        request,
      }),
    );
  }),
);
