import asyncHandler from '../helpers/asyncHandler';
import { ensureRole } from '../../config';
import { v1Router } from '../v1Router';
import { AdminRegénérerPeriodeAttestationsPage } from '../../views';

import { GET_REGENERER_CERTIFICATS } from '@potentiel/legacy-routes';

v1Router.get(
  GET_REGENERER_CERTIFICATS,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    response.send(
      AdminRegénérerPeriodeAttestationsPage({
        request,
      }),
    );
  }),
);
