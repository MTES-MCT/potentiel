import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { ListeProjetsAbandonnésAvecRecandidaturePage } from '../../views';
import { vérifierPermissionUtilisateur } from '../helpers';

import { PermissionListerProjetsAbandonnésAvecRecandidature } from '@potentiel/domain';
import { ProjetReadModel } from '@potentiel/domain-views';

const getFakeProjets = () => {
  const fakeProjets: ProjetReadModel[] = [];
  for (let i = 1; i <= 10; i += 1) {
    fakeProjets.push({
      legacyId: `${i}`,
      nom: `Projet ${i}`,
      appelOffre: 'CRE4 - Bâtiment',
      période: `${i}`,
      famille: '1',
      numéroCRE: 'NuméroCRE',
      localité: {
        commune: 'Bordeaux',
        département: 'Gironde',
        région: 'Nouvelle Aquitaine',
      },
      statut: 'abandonné',
      type: 'projet',
      identifiantProjet: `CRE4 - Bâtiment#1#1#NuméroCRE`,
    });
  }

  return fakeProjets;
};

v1Router.get(
  routes.LISTE_PROJETS_ABANDONNÉS_AVEC_RECANDIDATURE,
  vérifierPermissionUtilisateur(PermissionListerProjetsAbandonnésAvecRecandidature),
  asyncHandler(async (request, response) =>
    response.send(
      ListeProjetsAbandonnésAvecRecandidaturePage({
        request,
        projets: getFakeProjets(),
      }),
    ),
  ),
);
