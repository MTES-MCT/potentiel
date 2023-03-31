import {
  Given as EtantDonné,
  When as Quand,
  Then as Alors,
  setWorldConstructor,
  DataTable,
} from '@cucumber/cucumber';
import {
  ajouterGestionnaireRéseauCommandHandlerFactory,
  consulterGestionnaireRéseauQueryHandlerFactory,
  GestionnaireRéseauDéjàExistantError,
  GestionnaireRéseauReadModel,
  listerGestionnaireRéseauQueryHandlerFactory,
} from '@potentiel/domain';
import { publish, loadAggregate } from '@potentiel/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { GestionnaireRéseauWorld } from './gestionnaireRéseau.world';

setWorldConstructor(GestionnaireRéseauWorld);

EtantDonné(
  'un gestionnaire de réseau ayant pour code EIC {string}',
  async function (this: GestionnaireRéseauWorld, codeEIC: string) {
    await this.createGestionnaireRéseau(codeEIC, 'Une raison sociale');
  },
);

Quand(
  'un administrateur ajoute un gestionnaire de réseau',
  async function (this: GestionnaireRéseauWorld, table: DataTable) {
    const example = table.rowsHash();
    this.codeEIC = example['Code EIC'];
    this.raisonSociale = example['Raison sociale'];
    this.format = example['Format'];
    this.légende = example['Légende'];

    const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauCommandHandlerFactory({
      publish,
      loadAggregate,
    });

    const command = {
      codeEIC: example['Code EIC'],
      raisonSociale: example['Raison sociale'],
      aideSaisieRéférenceDossierRaccordement: {
        format: example['Format'],
        légende: example['Légende'],
      },
    };

    await ajouterGestionnaireRéseau(command);
  },
);

Quand(
  'un administrateur ajoute un gestionnaire de réseau ayant le même code EIC',
  async function (this: GestionnaireRéseauWorld) {
    const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauCommandHandlerFactory({
      publish,
      loadAggregate,
    });

    try {
      await ajouterGestionnaireRéseau({
        codeEIC: this.codeEIC,
        raisonSociale: 'autre raison sociale',
        aideSaisieRéférenceDossierRaccordement: {
          format: 'autre format',
          légende: 'autre légende',
        },
      });
    } catch (err) {
      if (err instanceof GestionnaireRéseauDéjàExistantError) {
        this.error = err;
      }
    }
  },
);

Alors('le gestionnaire devrait être ajouté', async function (this: GestionnaireRéseauWorld) {
  const consulterGestionnaireRéseau = consulterGestionnaireRéseauQueryHandlerFactory({
    findGestionnaireRéseau: findProjection,
  });

  const listerGestionnaireRéseau = listerGestionnaireRéseauQueryHandlerFactory({
    listGestionnaireRéseau: listProjection,
  });

  await waitForExpect(async () => {
    const expected: GestionnaireRéseauReadModel = {
      type: 'gestionnaire-réseau',
      codeEIC: this.codeEIC,
      raisonSociale: this.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        légende: this.légende,
        format: this.format,
      },
    };

    const actual = await consulterGestionnaireRéseau({ codeEIC: this.codeEIC });
    const actualList = await listerGestionnaireRéseau({});

    actual.should.be.deep.equal(expected);
    actualList.should.deep.contain(expected);
  });
});
