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
import {
  PermissionListerProjets,
  FiltreListeProjets,
} from '../../modules/project/queries/listerProjets';
import { UtilisateurReadModel } from '../../modules/utilisateur/récupérer/UtilisateurReadModel';

const getFiltres = ({
  query,
  user,
}: {
  query: {
    appelOffreId?: string;
    periodeId?: string;
    familleId?: string;
    recherche?: FiltreListeProjets['recherche'];
    classement?: FiltreListeProjets['classement'];
    reclames?: FiltreListeProjets['reclames'];
    garantiesFinancieres?: FiltreListeProjets['garantiesFinancieres'];
  };
  user: UtilisateurReadModel;
}) => {
  let {
    appelOffreId,
    periodeId,
    familleId,
    recherche,
    classement,
    reclames,
    garantiesFinancieres,
  } = query;

  if (userIs(['admin', 'dgec-validateur', 'dreal'])(user) && typeof classement === 'undefined') {
    classement = 'classés';
  }

  if (!query.appelOffreId) {
    periodeId = undefined;
    familleId = undefined;
  }

  return {
    recherche,
    user,
    appelOffre:
      appelOffreId || periodeId || familleId
        ? {
            appelOffreId,
            periodeId,
            familleId,
          }
        : undefined,
    classement,
    reclames,
    garantiesFinancieres,
  };
};

const getProjectListPage = asyncHandler(async (request, response) => {
  let { query, user } = request;

  if (
    userIs(['admin', 'dgec-validateur', 'dreal'])(user) &&
    typeof query.classement === 'undefined'
  ) {
    request.query.classement = 'classés';
  }

  const filtres = getFiltres({
    query,
    user,
  });

  const pagination = getPagination(request);

  const projects = await listerProjets({ user, filtres, pagination });

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
