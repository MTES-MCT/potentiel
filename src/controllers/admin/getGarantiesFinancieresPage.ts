import { appelOffreRepo } from '@dataAccess';
import asyncHandler from '../helpers/asyncHandler';
import routes from '@routes';
import { ensureRole } from '@config';
import { v1Router } from '../v1Router';
import { GarantiesFinancieresPage } from '@views';
import { getCurrentUrl, getPagination, getOptionsFiltresParAOs } from '../helpers';
import { listerProjets } from '@infra/sequelize/queries';

const getGarantiesFinancieresPage = asyncHandler(async (request, response) => {
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

  const { user } = request;
  const projects = await listerProjets({
    pagination,
    user,
    filtres,
  });

  const optionsFiltresParAOs = await getOptionsFiltresParAOs({ user, appelOffreId });

  response.send(
    GarantiesFinancieresPage({
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
  ensureRole(['dreal']),
  getGarantiesFinancieresPage,
);
