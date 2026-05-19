import { type DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import { mediator } from 'mediateur';

import type { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { fakeLocations } from '../../helpers/faker/getFakeLocation.js';
import type { PotentielWorld } from '../../potentiel.world.js';

EtantDonné(
  'le gestionnaire de réseau avec :',
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    const partialFixture = this.gestionnaireRéseauWorld.mapExempleToFixtureValues(exemple);

    const { codeEIC, raisonSociale, expressionReguliere, format, légende, contactEmail } =
      this.gestionnaireRéseauWorld.ajouterGestionnaireRéseauFixture.créer(partialFixture);

    await mediator.send<GestionnaireRéseau.AjouterGestionnaireRéseauUseCase>({
      type: 'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseauValue: codeEIC,
        raisonSocialeValue: raisonSociale,
        aideSaisieRéférenceDossierRaccordementValue: {
          expressionReguliereValue: expressionReguliere,
          formatValue: format,
          légendeValue: légende,
        },
        contactEmailValue: contactEmail,
      },
    });
  },
);

EtantDonné(
  'le gestionnaire de réseau {string}',
  async function (this: PotentielWorld, raisonSocialeValeur: string) {
    const codeEICValue = raisonSocialeValeur.toUpperCase();
    const { codeEIC, raisonSociale, expressionReguliere, format, légende, contactEmail } =
      this.gestionnaireRéseauWorld.ajouterGestionnaireRéseauFixture.créer({
        codeEIC: codeEICValue,
        raisonSociale: raisonSocialeValeur,
      });

    await mediator.send<GestionnaireRéseau.AjouterGestionnaireRéseauUseCase>({
      type: 'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseauValue: codeEIC,
        raisonSocialeValue: raisonSociale,
        contactEmailValue: contactEmail,
        aideSaisieRéférenceDossierRaccordementValue: {
          expressionReguliereValue: expressionReguliere,
          formatValue: format,
          légendeValue: légende,
        },
      },
    });

    this.utilisateurWorld.grdFixture.créer({ nom: raisonSociale });
  },
);

// Ce step assigne de manière aléatoire chacun des gestionnaires réseau
// présent dans les fixtures à une (ou plusieurs) ville(s), imitant ainsi le référentiel ORE
EtantDonné('le référentiel ORE', async function (this: PotentielWorld) {
  for (const city of fakeLocations) {
    const { codeEIC, raisonSociale } = faker.helpers.arrayElement([
      ...this.gestionnaireRéseauWorld.gestionnairesRéseauFixtures.values(),
    ]);
    this.gestionnaireRéseauWorld.référentielOREFixtures.push({
      codeEIC,
      raisonSociale,
      codePostal: city.codePostal,
      commune: city.commune,
    });
  }
});
