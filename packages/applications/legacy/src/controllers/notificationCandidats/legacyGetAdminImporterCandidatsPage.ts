import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { ensureRole } from '../../config';
import { v1Router } from '../v1Router';
import { LegacyAdminImporterCandidatsPage } from '../../views';

/**
 * @deprecated
 * @description Route legacy pour avoir la page d'import des projets
 */
v1Router.get(
  routes.LEGACY_IMPORT_PROJECTS,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    return response.send(
      LegacyAdminImporterCandidatsPage({
        request,
      }),
    );
  }),
);
