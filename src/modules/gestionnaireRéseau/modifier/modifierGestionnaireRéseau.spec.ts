import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { AggregateId, isNone } from '@potentiel/core-domain';
import { modifierGestionnaireRéseauFactory } from './modifierGestionnaireRéseau';
import { loadGestionnaireRéseauAggregateFactory } from '../loadGestionnaireRéseauAggregate.factory';

describe('Modifier un gestionnaire de réseau', () => {
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  it(`
    Etant donné un gestionnaire de réseau
    Lorsque un administrateur modifie la raison sociale du gestionnaire de réseau
    Alors la raison sociale du gestionnaire de réseau devrait être mise à jour
  `, async () => {
    // Arrange
    const codeEIC = '17X100A100A0001A';
    const aggregateId = `gestionnaire-réseau#${codeEIC}` satisfies AggregateId;

    await publish(aggregateId, {
      type: 'GestionnaireRéseauAjouté',
      payload: {
        codeEIC,
        raisonSociale: 'RTE',
      },
    });

    // Act
    const modifierGestionnaireRéseau = modifierGestionnaireRéseauFactory({ publish });

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
});
