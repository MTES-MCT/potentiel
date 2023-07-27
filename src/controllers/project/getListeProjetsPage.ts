import asyncHandler from '../helpers/asyncHandler';
import routes from '@routes';
import { v1Router } from '../v1Router';
import { ListeProjetsPage } from '@views';
import { userIs } from '@modules/users';
import {
  getOptionsFiltresParAOs,
  vérifierPermissionUtilisateur,
  getCurrentUrl,
  getPagination,
} from '../helpers';
import { appelOffreRepo } from '@dataAccess';
import { listerProjets } from '@infra/sequelize/queries';
import {
  FiltreListeProjets,
  PermissionListerProjets,
} from '@modules/project/queries/listerProjets';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';

const getProjectListPage = asyncHandler(async (request, response) => {
  let {
    query: {
      appelOffreId,
      periodeId,
      familleId,
      recherche,
      classement,
      reclames,
      garantiesFinancieres,
    },
    user,
  } = request;
  const utilisateur = user as UtilisateurReadModel;

  // Set default filter on classés for admins
  if (
    userIs(['admin', 'dgec-validateur', 'dreal'])(utilisateur) &&
    typeof classement === 'undefined'
  ) {
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
  } as FiltreListeProjets;

  const projects = await listerProjets({ user: utilisateur, filtres, pagination });

  const appelsOffre = await appelOffreRepo.findAll();

  const optionsFiltresParAOs = await getOptionsFiltresParAOs({
    user,
    appelOffreId: filtres.appelOffre?.appelOffreId,
  });
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
