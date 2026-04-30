import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { faker } from '@faker-js/faker';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { PotentielWorld } from '../../potentiel.world.js';
import { fakeLocations } from '../../helpers/faker/getFakeLocation.js';

EtantDonné('un gestionnaire de réseau', async function (this: PotentielWorld, table: DataTable) {
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

  // viovio
  // à voir pour virer ça ?
  this.gestionnaireRéseauWorld.gestionnairesRéseauFixtures.set(raisonSociale, {
    codeEIC,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement: {
      expressionReguliere,
      format,
      légende,
    },
    contactEmail,
  });
});

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

    // viovio
    // à voir pour virer ça ?
    this.gestionnaireRéseauWorld.gestionnairesRéseauFixtures.set(raisonSociale, {
      codeEIC,
      raisonSociale,
      contactEmail,
      aideSaisieRéférenceDossierRaccordement: {
        expressionReguliere,
        format,
        légende,
      },
    });
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
