import { publish } from '@potentiel/pg-event-sourcing';
import { AggregateId } from '@potentiel/core-domain';
import { modifierGestionnaireRéseauFactory } from './modifierGestionnaireRéseau';

describe('Modifier un gestionnaire de réseau', () => {
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

    const gestionnaireRéseau = await loadGestionnaireRéseauAggreagate(codeEIC);

    // Assert
    expect(gestionnaireRéseau.raisonSociale).toEqual('ENEDIS');
  });
});
