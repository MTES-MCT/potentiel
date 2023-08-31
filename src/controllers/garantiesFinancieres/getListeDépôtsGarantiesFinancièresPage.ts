import routes from '../../routes';
import { v1Router } from '../v1Router';
import {
  getCurrentUrl,
  getPagination,
  notFoundResponse,
  vérifierPermissionUtilisateur,
} from '../helpers';
import { ListerDépôtsGarantiesFinancièresQuery } from '@potentiel/domain-views';
import { ListerDépôtsGarantiesFinancièresPage } from '../../views';
import { mediator } from 'mediateur';
import { PermissionConsulterListeDépôts } from '@potentiel/domain';
import asyncHandler from '../helpers/asyncHandler';
import { UserDreal } from '../../infra/sequelize/projectionsNext';

v1Router.get(
  routes.GET_LISTE_DEPOTS_GARANTIES_FINANCIERES_PAGE(),
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

    const résultat = await mediator.send<ListerDépôtsGarantiesFinancièresQuery>({
      type: 'LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES',
      data: {
        région: userRégion.dreal,
        pagination: { page, itemsPerPage },
      },
    });

    return response.send(
      ListerDépôtsGarantiesFinancièresPage({
        user,
        listeDépôtsGarantiesFinancières: résultat.liste,
        pagination: { ...résultat.pagination, currentUrl: getCurrentUrl(request) },
      }),
    );
  }),
);
