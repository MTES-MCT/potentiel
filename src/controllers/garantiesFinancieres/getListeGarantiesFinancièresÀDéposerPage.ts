import routes from '../../routes';
import { v1Router } from '../v1Router';
import {
  getCurrentUrl,
  getPagination,
  notFoundResponse,
  vérifierPermissionUtilisateur,
} from '../helpers';
import { ListeGarantiesFinancièresÀDéposerPage } from '../../views';
import { PermissionConsulterListeDépôts } from '@potentiel/domain';
import asyncHandler from '../helpers/asyncHandler';
import { UserDreal } from '../../infra/sequelize/projectionsNext';
import { ProjetReadModel } from '@potentiel/domain-views';

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

    // FAKE DONNÉES À SUPPRIMER - POUR TEST FRONT
    const projets: ReadonlyArray<
      Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire'> & { dateLimiteDeDépôt?: string }
    > = [
      {
        appelOffre: 'PPE2 - Eolien',
        période: '1',
        famille: '1',
        numéroCRE: 'AZERT',
        identifiantProjet: 'PPE2 - Eolien#1#1#AZERT',
        legacyId: 'ddgfd',
        localité: { commune: 'Paris', département: 'Paris', région: 'Ile-de-France' },
        nom: 'Centrale-Sol',
        statut: 'classé',
        dateLimiteDeDépôt: new Date('2023-12-01').toISOString(),
      },
      {
        appelOffre: 'PPE2 - Eolien',
        période: '1',
        famille: '1',
        numéroCRE: 'AZE',
        identifiantProjet: 'PPE2 - Eolien#1#1#AZE',
        legacyId: 'gfd',
        localité: { commune: 'Paris', département: 'Paris', région: 'Ile-de-France' },
        nom: 'Centrale-Solaire',
        statut: 'classé',
        dateLimiteDeDépôt: new Date('2023-01-01').toISOString(),
      },
      {
        appelOffre: 'PPE2 - Eolien',
        période: '1',
        famille: '1',
        numéroCRE: 'NBV',
        identifiantProjet: 'PPE2 - Eolien#1#1#NBV',
        legacyId: 'gfd',
        localité: { commune: 'Paris', département: 'Paris', région: 'Ile-de-France' },
        nom: 'Centrale-Solaire-2',
        statut: 'classé',
      },
    ];
    const résultat = { pagination: { currentPage: 1, pageCount: 1 }, liste: projets };
    // TODO : AJOUTER QUERY ICI
    // FAKE

    return response.send(
      ListeGarantiesFinancièresÀDéposerPage({
        user,
        projets: résultat.liste,
        pagination: { ...résultat.pagination, currentUrl: getCurrentUrl(request) },
      }),
    );
  }),
);
