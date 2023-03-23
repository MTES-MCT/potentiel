import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { executeQuery } from '@potentiel/pg-helpers';
import {
  ajouterGestionnaireRéseauFactory,
  consulterGestionnaireRéseauFactory,
  ConsulterGestionnaireRéseauReadModel,
  createGestionnaireRéseauAggregateId,
  GestionnaireRéseauDéjàExistantError,
} from '@potentiel/domain';
import { findReadModel } from '@potentiel/pg-projections';

describe(`Ajouter un gestionnaire de réseau`, () => {
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(async () => {
    await executeQuery(`DELETE FROM "EVENT_STREAM"`);
    await executeQuery(`DELETE FROM "PROJECTION"`);
  });

  const codeEIC = '17X100A100A0001A';
  const raisonSociale = 'Enedis';
  const format = 'XX-YY-ZZ';
  const légende = 'la légende';

  it(`Lorsqu'un administrateur ajoute un gestionnaire de réseau
      Alors le gestionnaire devrait être ajouté`, async () => {
    const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauFactory({
      publish,
      loadAggregate,
    });

    await ajouterGestionnaireRéseau({
      codeEIC,
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format,
        légende,
      },
    });

    const consulterGestionnaireRéseauQueryHandler = consulterGestionnaireRéseauFactory({
      findGestionnaireRéseau: findReadModel,
    });

    const actual = await consulterGestionnaireRéseauQueryHandler({ codeEIC });

    // Assert
    const expected: ConsulterGestionnaireRéseauReadModel = {
      codeEIC,
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format,
        légende,
      },
    };

    expect(actual).toEqual(expected);
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

    const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauFactory({
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
