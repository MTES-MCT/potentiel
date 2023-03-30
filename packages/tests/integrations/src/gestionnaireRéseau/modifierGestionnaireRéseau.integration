import { loadAggregate, publish, subscribe } from '@potentiel/pg-event-sourcing';
import { executeQuery } from '@potentiel/pg-helpers';
import {
  modifierGestionnaireRéseauFactory,
  createGestionnaireRéseauAggregateId,
  GestionnaireRéseauInconnuError,
  GestionnaireRéseauAjoutéEvent,
  consulterGestionnaireRéseauQueryHandlerFactory,
  gestionnaireRéseauAjoutéHandlerFactory,
  gestionnaireRéseauModifiéHandlerFactory,
  GestionnaireRéseauModifiéEvent,
  listerGestionnaireRéseauQueryHandlerFactory,
} from '@potentiel/domain';
import { Unsubscribe } from '@potentiel/core-domain';
import waitForExpect from 'wait-for-expect';
import {
  createProjection,
  findProjection,
  listProjection,
  updateProjection,
} from '@potentiel/pg-projections';

describe('Modifier un gestionnaire de réseau', () => {
  let unsubscribeAjouté: Unsubscribe | undefined;
  let unsubscribeModifié: Unsubscribe | undefined;

  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(async () => {
    await executeQuery(`DELETE FROM "EVENT_STREAM"`);
    await executeQuery(`DELETE FROM "PROJECTION"`);
  });

  afterEach(async () => {
    if (unsubscribeAjouté) {
      await unsubscribeAjouté();
      unsubscribeAjouté = undefined;
    }

    if (unsubscribeModifié) {
      await unsubscribeModifié();
      unsubscribeModifié = undefined;
    }
  });

  const codeEIC = '17X100A100A0001A';
  const raisonSociale = 'Enedis';
  const format = 'XX-YY-ZZ';
  const légende = 'la légende';

  it(`
    Etant donné un gestionnaire de réseau
    Lorsque un administrateur modifie les données d'un gestionnaire de réseau
    Alors le gestionnaire de réseau devrait être mis à jour
  `, async () => {
    // Arrange
    const gestionnaireRéseauAjouté: GestionnaireRéseauAjoutéEvent = {
      type: 'GestionnaireRéseauAjouté',
      payload: {
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement: {
          format,
          légende,
        },
      },
    };

    const gestionnaireRéseauAjoutéHandler = gestionnaireRéseauAjoutéHandlerFactory({
      create: createProjection,
    });

    unsubscribeAjouté = await subscribe<GestionnaireRéseauAjoutéEvent>(
      'GestionnaireRéseauAjouté',
      gestionnaireRéseauAjoutéHandler,
    );

    const gestionnaireRéseauModifiéHandler = gestionnaireRéseauModifiéHandlerFactory({
      update: updateProjection,
    });

    unsubscribeModifié = await subscribe<GestionnaireRéseauModifiéEvent>(
      'GestionnaireRéseauModifié',
      gestionnaireRéseauModifiéHandler,
    );

    await publish(createGestionnaireRéseauAggregateId(codeEIC), gestionnaireRéseauAjouté);

    // Act
    const modifierGestionnaireRéseau = modifierGestionnaireRéseauFactory({
      publish,
      loadAggregate,
    });

    await modifierGestionnaireRéseau({
      codeEIC,
      raisonSociale: 'RTE',
      aideSaisieRéférenceDossierRaccordement: {
        format: 'AAA-BBB',
        légende: 'des lettres séparées par un tiret',
      },
    });

    // Assert
    const consulterGestionnaireRéseau = consulterGestionnaireRéseauQueryHandlerFactory({
      findGestionnaireRéseau: findProjection,
    });
    await waitForExpect(async () => {
      const actual = await consulterGestionnaireRéseau({ codeEIC });

      // Assert
      const expected: typeof actual = {
        type: 'gestionnaire-réseau',
        codeEIC,
        raisonSociale: 'RTE',
        aideSaisieRéférenceDossierRaccordement: {
          format: 'AAA-BBB',
          légende: 'des lettres séparées par un tiret',
        },
      };

      expect(actual).toEqual(expected);
    });

    const listerGestionnaireRéseau = listerGestionnaireRéseauQueryHandlerFactory({
      listGestionnaireRéseau: listProjection,
    });
    await waitForExpect(async () => {
      const actuals = await listerGestionnaireRéseau({});

      // Assert
      const expected: typeof actuals[number] = {
        type: 'gestionnaire-réseau',
        codeEIC,
        raisonSociale: 'RTE',
        aideSaisieRéférenceDossierRaccordement: {
          format: 'AAA-BBB',
          légende: 'des lettres séparées par un tiret',
        },
      };

      expect(actuals).toContainEqual(expected);
    });
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
