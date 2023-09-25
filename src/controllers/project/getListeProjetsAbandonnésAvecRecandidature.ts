import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { ListeProjetsAbandonnésAvecRecandidaturePage } from '../../views';
import {
  vérifierPermissionUtilisateur,
} from '../helpers';

import { PermissionListerProjetsAbandonnésAvecRecandidature } from '@potentiel/domain';

// const getProjectListPage = asyncHandler(async (request, response) => {
//   let { query, user } = request;

//   if (
//     userIs(['admin', 'dgec-validateur', 'dreal'])(user) &&
//     typeof query.classement === 'undefined'
//   ) {
//     request.query.classement = 'classés';
//   }

//   const filtres = getFiltres({
//     query,
//     user,
//   });

//   const pagination = getPagination(request);

//   const projects = await listerProjets({ user, filtres, pagination });

//   const appelsOffre = await appelOffreRepo.findAll();

//   const optionsFiltresParAOs = await getOptionsFiltresParAOs({
//     user,
//     appelOffreId: filtres.appelOffre?.appelOffreId,
//   });
//   response.send(
//     ListeProjetsPage({
//       request,
//       projects,
//       appelsOffre,
//       ...optionsFiltresParAOs,
//       currentUrl: getCurrentUrl(request),
//     }),
//   );
// });

v1Router.get(
  routes.LISTE_PROJETS_ABANDONNÉS_AVEC_RECANDIDATURE,
  vérifierPermissionUtilisateur(PermissionListerProjetsAbandonnésAvecRecandidature),
  asyncHandler(async (request, response) => {
    console.log('YO');
    response.send(
      ListeProjetsAbandonnésAvecRecandidaturePage({
        request,
        projets: [],
      }),
    );
    // response
  }),
);
