import asyncHandler from '../helpers/asyncHandler';
import { v1Router } from '../v1Router';
import { HomePage } from '../../views';
import { GET_PAGE_ACCUEIL } from '@potentiel/legacy-routes';

v1Router.get(
  GET_PAGE_ACCUEIL,
  asyncHandler(async (request, response) => {
    response.send(
      HomePage({
        request,
      }),
    );
  }),
);
