import { describe, expect, it } from '@jest/globals';
import { drealActions } from '.';
import ROUTES from '../../../routes';
import makeFakeProject from '../../../__tests__/fixtures/project';

describe('drealActions', () => {
  it(`Etant donné un projet avec garanties financières dont le statut est "à traiter"
      Alors l'appel à drealActions devrait retourner une seul action 'Marquer la garantie financière comme validée'`, () => {
    const fakeProject = makeFakeProject({
      id: '1',
      garantiesFinancières: { id: '1', statut: 'à traiter' },
    });
    const result = drealActions(fakeProject);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      title: 'Marquer la garantie financière comme validée',
      link: ROUTES.VALIDER_GF({
        projetId: fakeProject.id,
      }),
    });
  });
  it(`Etant donné un projet avec garanties financières dont le statut est "validé"
      Alors l'appel à drealActions devrait retourner une seul action 'Marquer la garantie financière comme à traiter'`, () => {
    const fakeProject = makeFakeProject({
      id: '1',
      garantiesFinancières: { id: '1', statut: 'validé' },
    });
    const result = drealActions(fakeProject);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      title: 'Marquer la garantie financière comme à traiter',
      link: ROUTES.INVALIDER_GF({
        projetId: fakeProject.id,
      }),
    });
  });
  it(`Etant donné un projet sans garanties financières
      Alors l'appel à drealActions devrait retourner un tableau vide`, () => {
    const fakeProject = makeFakeProject();
    const result = drealActions(fakeProject);
    expect(result).toEqual([]);
  });
});
