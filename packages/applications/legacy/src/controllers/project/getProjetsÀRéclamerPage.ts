import { appelOffreRepo } from '../../dataAccess';
import routes from '../../routes';
import { listMissingOwnerProjects } from '../../useCases';
import { ensureRole } from '../../config';
import { v1Router } from '../v1Router';
import asyncHandler from '../helpers/asyncHandler';
import { ProjetsÀRéclamerPage } from '../../views';
import { getCurrentUrl, getPagination } from '../helpers';

const getMissingOwnerProjectListPage = asyncHandler(async (request, response) => {
  let { appelOffreId, periodeId, familleId, recherche, classement, garantiesFinancieres } =
    request.query as any;
  const { user } = request;

  // Set default filter on classés for admins
  if (
    ['admin', 'dgec-validateur', 'dreal'].includes(user.role) &&
    typeof classement === 'undefined'
  ) {
    classement = 'classés';
    request.query.classement = 'classés';
  }

  const pagination = getPagination(request);

  const appelsOffre = await appelOffreRepo.findAll();

  if (!appelOffreId) {
    // Reset the periodId and familleId if there is no appelOffreId
    periodeId = undefined;
    familleId = undefined;
  }

  const results = await listMissingOwnerProjects({
    user,
    appelOffreId,
    periodeId,
    familleId,
    pagination,
    recherche,
    classement,
    garantiesFinancieres,
  });

  const { projects, existingAppelsOffres, existingPeriodes, existingFamilles } = results;

  response.send(
    ProjetsÀRéclamerPage({
      request,
      projects,
      existingAppelsOffres,
      existingPeriodes,
      existingFamilles,
      appelsOffre,
      currentUrl: getCurrentUrl(request),
    }),
  );
});

v1Router.get(
  routes.USER_LIST_MISSING_OWNER_PROJECTS,
  ensureRole(['porteur-projet']),
  getMissingOwnerProjectListPage,
);
