import { loadAggregate, publish, subscribe } from '@potentiel/pg-event-sourcing';
import { executeQuery } from '@potentiel/pg-helpers';
import {
  ajouterGestionnaireRéseauCommandHandlerFactory,
  consulterGestionnaireRéseauQueryHandlerFactory,
  createGestionnaireRéseauAggregateId,
  GestionnaireRéseauAjoutéEvent,
  gestionnaireRéseauAjoutéHandlerFactory,
  GestionnaireRéseauDéjàExistantError,
} from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { Unsubscribe } from '@potentiel/core-domain';
import { createProjection } from '@potentiel/pg-projections/dist/createProjection';

describe(`Ajouter un gestionnaire de réseau`, () => {
  let unsubscribe: Unsubscribe;

  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(async () => {
    await executeQuery(`DELETE FROM "EVENT_STREAM"`);
    await executeQuery(`DELETE FROM "PROJECTION"`);
  });

  afterEach(() => unsubscribe());

  const codeEIC = '17X100A100A0001A';
  const raisonSociale = 'Enedis';
  const format = 'XX-YY-ZZ';
  const légende = 'la légende';

  it(`Lorsqu'un administrateur ajoute un gestionnaire de réseau
      Alors le gestionnaire devrait être ajouté`, async () => {
    // Arrange
    const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauCommandHandlerFactory({
      publish,
      loadAggregate,
    });

    const consulterGestionnaireRéseau = consulterGestionnaireRéseauQueryHandlerFactory({
      findGestionnaireRéseau: findProjection,
    });

    const gestionnaireRéseauAjoutéHandler =
      gestionnaireRéseauAjoutéHandlerFactory(createProjection);

    unsubscribe = await subscribe<GestionnaireRéseauAjoutéEvent>(
      'GestionnaireRéseauAjouté',
      gestionnaireRéseauAjoutéHandler,
    );

    // Act
    await ajouterGestionnaireRéseau({
      codeEIC,
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format,
        légende,
      },
    });

    await waitForExpect(async () => {
      const actual = await consulterGestionnaireRéseau({ codeEIC });

      // Assert
      const expected: typeof actual = {
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement: {
          format,
          légende,
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  it(`Etant donné un gestionnaire de réseau
      Lorsqu'un admin ajoute un gestionnaire ayant le même code EIC
      Alors le gestionnaire de réseau ne devrait pas être ajouté
      Et l'admin devrait être informé que le gestionnaire existe déjà`, async () => {
    await publish(createGestionnaireRéseauAggregateId(codeEIC), {
      type: 'GestionnaireRéseauAjouté',
      payload: {
        codeEIC,
        raisonSociale: 'RTE',
      },
    });

    const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauCommandHandlerFactory({
      publish,
      loadAggregate,
    });

    const promise = ajouterGestionnaireRéseau({
      codeEIC,
      raisonSociale: 'ENEDIS',
      aideSaisieRéférenceDossierRaccordement: { format: '', légende: '' },
    });

    // Assert
    await expect(promise).rejects.toThrow(GestionnaireRéseauDéjàExistantError);
  });
});
