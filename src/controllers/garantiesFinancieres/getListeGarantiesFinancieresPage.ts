import { appelOffreRepo } from '../../dataAccess';
import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { ListeGarantiesFinancieresPage } from '../../views';
import {
  getCurrentUrl,
  getPagination,
  getOptionsFiltresParAOs,
  vérifierPermissionUtilisateur,
} from '../helpers';
import { listerGarantiesFinancièresPourDreal } from '../../infra/sequelize/queries';
import { PermissionConsulterListeGarantiesFinancières } from '@potentiel/domain';
import { UtilisateurReadModel } from '../../modules/utilisateur/récupérer/UtilisateurReadModel';

const getListeGarantiesFinancieresPage = asyncHandler(async (request, response) => {
  const { appelOffreId, periodeId, familleId, recherche, garantiesFinancieres } =
    request.query as any;

  const pagination = getPagination(request);

  const appelsOffre = await appelOffreRepo.findAll();

  const filtres = {
    appelOffre: {
      appelOffreId,
      periodeId: appelOffreId ? periodeId : undefined,
      familleId: appelOffreId ? familleId : undefined,
    },
    recherche,
    classement: 'classés' as const,
    reclames: undefined,
    garantiesFinancieres,
  };

  const user = request.user as UtilisateurReadModel;

  const projects = await listerGarantiesFinancièresPourDreal({
    pagination,
    user,
    filtres,
  });

  const optionsFiltresParAOs = await getOptionsFiltresParAOs({ user, appelOffreId });

  response.send(
    ListeGarantiesFinancieresPage({
      request,
      projects,
      appelsOffre,
      ...optionsFiltresParAOs,
      currentUrl: getCurrentUrl(request),
    }),
  );
});

v1Router.get(
  routes.ADMIN_GARANTIES_FINANCIERES,
  vérifierPermissionUtilisateur(PermissionConsulterListeGarantiesFinancières),
  getListeGarantiesFinancieresPage,
);
