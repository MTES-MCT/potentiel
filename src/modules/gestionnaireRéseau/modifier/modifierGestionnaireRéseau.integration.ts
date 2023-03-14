import { executeQuery, loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { isNone } from '@potentiel/core-domain';
import { modifierGestionnaireRéseauFactory } from './modifierGestionnaireRéseau';
import { loadGestionnaireRéseauAggregateFactory } from '../loadGestionnaireRéseauAggregate.factory';
import { createGestionnaireRéseauAggregateId } from '../gestionnaireRéseauAggregateId';
import { GestionnaireRéseauInconnuError } from './gestionnaireRéseauInconnuError';

describe('Modifier un gestionnaire de réseau', () => {
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(() => executeQuery(`DELETE FROM "EVENT_STREAM"`));

  it(`
    Etant donné un gestionnaire de réseau
    Lorsque un administrateur modifie la raison sociale du gestionnaire de réseau
    Alors la raison sociale du gestionnaire de réseau devrait être mise à jour
  `, async () => {
    // Arrange
    const codeEIC = '17X100A100A0001A';

    await publish(createGestionnaireRéseauAggregateId(codeEIC), {
      type: 'GestionnaireRéseauAjouté',
      payload: {
        codeEIC,
        raisonSociale: 'RTE',
      },
    });

    // Act
    const modifierGestionnaireRéseau = modifierGestionnaireRéseauFactory({
      publish,
      loadAggregate,
    });

    await modifierGestionnaireRéseau({
      codeEIC,
      raisonSociale: 'ENEDIS',
    });

    const loadGestionnaireRéseauAggregate = loadGestionnaireRéseauAggregateFactory({
      loadAggregate,
    });

    const gestionnaireRéseau = await loadGestionnaireRéseauAggregate(codeEIC);

    // Assert
    expect(isNone(gestionnaireRéseau)).toBe(false);
    if (!isNone(gestionnaireRéseau)) {
      expect(gestionnaireRéseau.raisonSociale).toEqual('ENEDIS');
    }
  });

  it(`Lorsque un administrateur modifie la raison sociale du gestionnaire de réseau inconnu
      Alors l'administrateur devrait être informer que le gestionnaire de réseau n'existe pas 
  `, async () => {
    // Arrange
    const codeEIC = '17X100A100A0001A';

    // Act
    const modifierGestionnaireRéseau = modifierGestionnaireRéseauFactory({
      publish,
      loadAggregate,
    });

    // Assert
    expect(() =>
      modifierGestionnaireRéseau({
        codeEIC,
        raisonSociale: 'ENEDIS',
      }),
    ).toThrowError(new GestionnaireRéseauInconnuError());
  });
});
