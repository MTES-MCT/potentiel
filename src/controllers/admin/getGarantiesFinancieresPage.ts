import { appelOffreRepo } from '@dataAccess';
import asyncHandler from '../helpers/asyncHandler';
import { makePagination } from '../../helpers/paginate';
import routes from '@routes';
import { Pagination } from '../../types';
import { ensureRole } from '@config';
import { v1Router } from '../v1Router';
import { GarantiesFinancieresPage } from '@views';
import { getOptionsFiltresParAOs } from '../helpers';
import { listerProjets } from '@infra/sequelize/queries';

const getGarantiesFinancieresPage = asyncHandler(async (request, response) => {
  const { appelOffreId, periodeId, familleId, recherche, garantiesFinancieres, pageSize } =
    request.query as any;
  const { user } = request;

  const defaultPagination: Pagination = {
    page: 0,
    pageSize: +request.cookies?.pageSize || 10,
  };
  const pagination = makePagination(request.query, defaultPagination);

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

  const projects = await listerProjets({
    pagination,
    user,
    filtres,
  });

  if (pageSize) {
    // Save the pageSize in a cookie
    response.cookie('pageSize', pageSize, {
      maxAge: 1000 * 60 * 60 * 24 * 30 * 3, // 3 months
      httpOnly: true,
    });
  }

  const optionsFiltresParAOs = await getOptionsFiltresParAOs({ user, appelOffreId });

  response.send(
    GarantiesFinancieresPage({
      request,
      projects,
      appelsOffre,
      ...optionsFiltresParAOs,
    }),
  );
});

v1Router.get(
  routes.ADMIN_GARANTIES_FINANCIERES,
  ensureRole(['dreal']),
  getGarantiesFinancieresPage,
);
