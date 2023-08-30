import routes from '../../routes';
import { v1Router } from '../v1Router';
import { vérifierPermissionUtilisateur } from '../helpers';
import { ListerDépôtsGarantiesFinancièresQuery } from '@potentiel/domain-views';
import { ListerDépôtsGarantiesFinancièresPage } from '../../views';
import { mediator } from 'mediateur';
import { PermissionConsulterListeDépôts } from '@potentiel/domain';
import asyncHandler from '../helpers/asyncHandler';

v1Router.get(
  routes.GET_LISTE_DEPOTS_GARANTIES_FINANCIERES_PAGE(),
  vérifierPermissionUtilisateur(PermissionConsulterListeDépôts),
  asyncHandler(async (request, response) => {
    const { user } = request;

    // TO DO : récupérer région de la dreal

    const résultat = await mediator.send<ListerDépôtsGarantiesFinancièresQuery>({
      type: 'LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES',
      data: {},
    });

    return response.send(
      ListerDépôtsGarantiesFinancièresPage({
        //@ts-ignore
        user,
        //@ts-ignore
        listeDépôtsGarantiesFinancières: résultat.liste,
        // error: error as string,
      }),
    );
  }),
);
