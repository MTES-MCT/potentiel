import asyncHandler from '../helpers/asyncHandler';
import { ensureRole } from '../../config';
import { v1Router } from '../v1Router';
import { AdminImporterCandidatsPage } from '../../views';

import { PAGE_IMPORT_CANDIDATS } from '@potentiel/legacy-routes';

v1Router.get(
  PAGE_IMPORT_CANDIDATS,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    return response.send(
      AdminImporterCandidatsPage({
        request,
      }),
    );
  }),
);
