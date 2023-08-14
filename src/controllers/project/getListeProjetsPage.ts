import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { ListeProjetsPage } from '../../views';
import { userIs } from '../../modules/users';
import {
  getOptionsFiltresParAOs,
  vérifierPermissionUtilisateur,
  getCurrentUrl,
  getPagination,
} from '../helpers';
import { appelOffreRepo } from '../../dataAccess';
import { listerProjets } from '../../infra/sequelize/queries';
import { PermissionListerProjets } from '../../modules/project/queries/listerProjets';

const getProjectListPage = asyncHandler(async (request, response) => {
  let {
    appelOffreId,
    periodeId,
    familleId,
    recherche,
    classement,
    reclames,
    garantiesFinancieres,
  } = request.query as any;
  const { user } = request;

  // Set default filter on classés for admins
  if (userIs(['admin', 'dgec-validateur', 'dreal'])(user) && typeof classement === 'undefined') {
    classement = 'classés';
    request.query.classement = 'classés';
  }

  const pagination = getPagination(request);

  if (!appelOffreId) {
    // Reset the periodId and familleId if there is no appelOffreId
    periodeId = undefined;
    familleId = undefined;
  }

  const filtres = {
    recherche,
    user,
    appelOffre: {
      appelOffreId,
      periodeId,
      familleId,
    },
    classement,
    reclames,
    garantiesFinancieres,
  };

  const projects = await listerProjets({ user, filtres, pagination });

  const appelsOffre = await appelOffreRepo.findAll();

  const optionsFiltresParAOs = await getOptionsFiltresParAOs({ user, appelOffreId });
  response.send(
    ListeProjetsPage({
      request,
      projects,
      appelsOffre,
      ...optionsFiltresParAOs,
      currentUrl: getCurrentUrl(request),
    }),
  );
});

v1Router.get(
  routes.LISTE_PROJETS,
  vérifierPermissionUtilisateur(PermissionListerProjets),
  getProjectListPage,
);
