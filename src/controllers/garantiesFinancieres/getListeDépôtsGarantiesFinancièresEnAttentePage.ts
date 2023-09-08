import routes from '../../routes';
import { v1Router } from '../v1Router';
import {
  getCurrentUrl,
  getPagination,
  notFoundResponse,
  vérifierPermissionUtilisateur,
} from '../helpers';
import { PermissionConsulterListeDépôts } from '@potentiel/domain';
import asyncHandler from '../helpers/asyncHandler';
import { UserDreal } from '../../infra/sequelize/projectionsNext';
import { mediator } from 'mediateur';
import { ListerDépôtsGarantiesFinancièresEnAttenteQuery } from '@potentiel/domain-views';
import { ListeDépôtsGarantiesFinancièresEnAttentePage } from '../../views';

v1Router.get(
  routes.GET_LISTE_GARANTIES_FINANCIERES_A_DEPOSER_PAGE(),
  vérifierPermissionUtilisateur(PermissionConsulterListeDépôts),
  asyncHandler(async (request, response) => {
    const { user } = request;

    const userRégion = await UserDreal.findOne({ where: { userId: user.id } });

    if (!userRégion) {
      return notFoundResponse({
        request,
        response,
        ressourceTitle: 'Région',
      });
    }
    const { page, pageSize: itemsPerPage } = getPagination(request);

    const résultat = await mediator.send<ListerDépôtsGarantiesFinancièresEnAttenteQuery>({
      type: 'LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES_EN_ATTENTE',
      data: { région: userRégion.dreal, pagination: { page, itemsPerPage } },
    });

    return response.send(
      ListeDépôtsGarantiesFinancièresEnAttentePage({
        user,
        projets: résultat.liste,
        pagination: { ...résultat.pagination, currentUrl: getCurrentUrl(request) },
      }),
    );
  }),
);
