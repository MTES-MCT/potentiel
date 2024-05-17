import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { mediator } from 'mediateur';
import { sleep } from '../../helpers/sleep';
import { PotentielWorld } from '../../potentiel.world';

EtantDonné('un gestionnaire de réseau', async function (this: PotentielWorld, table: DataTable) {
  const exemple = table.rowsHash();

  const raisonSociale = exemple['Raison sociale'] ?? 'Une raison sociale';
  const codeEIC = exemple['Code EIC'] ?? raisonSociale.toUpperCase();
  const aideSaisieRéférenceDossierRaccordement = {
    format: exemple['Format'],
    légende: exemple['Légende'],
    expressionReguliere: exemple['Expression régulière'],
  };
  const contactEmail = exemple['Email de contact'] ?? '';

  await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
    type: 'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
    data: {
      identifiantGestionnaireRéseauValue: codeEIC,
      raisonSocialeValue: raisonSociale,
      aideSaisieRéférenceDossierRaccordementValue: {
        expressionReguliereValue: aideSaisieRéférenceDossierRaccordement.expressionReguliere,
        formatValue: aideSaisieRéférenceDossierRaccordement.format,
        légendeValue: aideSaisieRéférenceDossierRaccordement.légende,
      },
      contactEmailValue: contactEmail,
    },
  });

  this.gestionnaireRéseauWorld.gestionnairesRéseauFixtures.set(raisonSociale, {
    codeEIC,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement,
    contactEmail,
  });
  await sleep(100);
});

EtantDonné(
  'le gestionnaire de réseau {string}',
  async function (this: PotentielWorld, raisonSociale: string) {
    const codeEIC = raisonSociale.toUpperCase();
    const aideSaisieRéférenceDossierRaccordement = {
      format: '',
      légende: '',
      expressionReguliere: '',
    };
    const contactEmail = '';

    await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
      type: 'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseauValue: codeEIC,
        raisonSocialeValue: raisonSociale,
        aideSaisieRéférenceDossierRaccordementValue: {
          expressionReguliereValue: aideSaisieRéférenceDossierRaccordement.expressionReguliere,
          formatValue: aideSaisieRéférenceDossierRaccordement.format,
          légendeValue: aideSaisieRéférenceDossierRaccordement.légende,
        },
        contactEmailValue: contactEmail,
      },
    });

    this.gestionnaireRéseauWorld.gestionnairesRéseauFixtures.set(raisonSociale, {
      codeEIC,
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement,
      contactEmail,
    });

    await sleep(100);
  },
);
