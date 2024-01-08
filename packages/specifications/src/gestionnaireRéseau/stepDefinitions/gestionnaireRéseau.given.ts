import { Given as EtantDonné, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import { mediator } from 'mediateur';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { sleep } from '../../helpers/sleep';

EtantDonné('un gestionnaire de réseau', async function (this: PotentielWorld, table: DataTable) {
  const exemple = table.rowsHash();

  const raisonSociale = exemple['Raison sociale'] ?? 'Une raison sociale';
  const codeEIC = exemple['Code EIC'] ?? raisonSociale.toUpperCase();
  const aideSaisieRéférenceDossierRaccordement = {
    format: exemple['Format'],
    légende: exemple['Légende'],
    expressionReguliere: exemple['Expression régulière'],
  };

  await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
    type: 'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
    data: {
      identifiantGestionnaireRéseauValue: codeEIC,
      raisonSocialeValue: raisonSociale,
      aideSaisieRéférenceDossierRaccordementValue: {
        expressionReguliereValue: aideSaisieRéférenceDossierRaccordement.expressionReguliere,
        formatValue: aideSaisieRéférenceDossierRaccordement.format,
        légendeValue: aideSaisieRéférenceDossierRaccordement.légende,
      },
    },
  });

  this.gestionnaireRéseauWorld.gestionnairesRéseauFixtures.set(raisonSociale, {
    codeEIC,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement,
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
      expressionReguliere: '(.*)',
    };

    await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
      type: 'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
      data: {
        identifiantGestionnaireRéseauValue: codeEIC,
        raisonSocialeValue: raisonSociale,
        aideSaisieRéférenceDossierRaccordementValue: {
          expressionReguliereValue: aideSaisieRéférenceDossierRaccordement.expressionReguliere,
          formatValue: aideSaisieRéférenceDossierRaccordement.format,
          légendeValue: aideSaisieRéférenceDossierRaccordement.légende,
        },
      },
    });

    this.gestionnaireRéseauWorld.gestionnairesRéseauFixtures.set(raisonSociale, {
      codeEIC,
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement,
    });
    await sleep(100);
  },
);
