import asyncHandler from './helpers/asyncHandler';
import { v1Router } from './v1Router';
import { DéclarationAccessibilitéPage } from '../views';

import { PAGE_DECLARATION_ACCESSIBILITE } from '@potentiel/legacy-routes';

v1Router.get(
  PAGE_DECLARATION_ACCESSIBILITE,
  asyncHandler(async (request, response) => {
    response.send(
      DéclarationAccessibilitéPage({
        request,
      }),
    );
  }),
);
