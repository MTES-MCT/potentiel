import { executeQuery, loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { isNone } from '@potentiel/core-domain';
import { modifierGestionnaireRéseauFactory } from './modifierGestionnaireRéseau.command';
import {
  GestionnaireRéseauState,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau.aggregate';
import { createGestionnaireRéseauAggregateId } from '../gestionnaireRéseauAggregateId';
import { GestionnaireRéseauInconnuError } from './gestionnaireRéseauInconnu.error';

describe('Modifier un gestionnaire de réseau', () => {
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(() => executeQuery(`DELETE FROM "EVENT_STREAM"`));

  it(`
    Etant donné un gestionnaire de réseau
    Lorsque un administrateur modifie les données d'un gestionnaire de réseau
    Alors le gestionnaire de réseau devrait être mis à jour
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
      aideSaisieRéférenceDossierRaccordement: {
        format: 'XXX-YYY',
        légende: 'des lettres séparées par un tiret',
      },
    });

    const loadGestionnaireRéseauAggregate = loadGestionnaireRéseauAggregateFactory({
      loadAggregate,
    });

    const gestionnaireRéseau = await loadGestionnaireRéseauAggregate(codeEIC);

    // Assert
    const expected: GestionnaireRéseauState = {
      codeEIC,
      raisonSociale: 'ENEDIS',
      aideSaisieRéférenceDossierRaccordement: {
        format: 'XXX-YYY',
        légende: 'des lettres séparées par un tiret',
      },
    };
    expect(isNone(gestionnaireRéseau)).toBe(false);
    if (!isNone(gestionnaireRéseau)) {
      expect(gestionnaireRéseau).toMatchObject(expected);
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

    const promise = modifierGestionnaireRéseau({
      codeEIC,
      raisonSociale: 'ENEDIS',
      aideSaisieRéférenceDossierRaccordement: { format: '', légende: '' },
    });

    // Assert
    await expect(promise).rejects.toThrow(GestionnaireRéseauInconnuError);
  });
});
