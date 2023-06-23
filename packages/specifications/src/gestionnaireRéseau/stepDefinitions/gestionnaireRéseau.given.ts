import { Given as EtantDonné, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import { mediator } from 'mediateur';
import { DomainUseCase, convertirEnIdentifiantGestionnaireRéseau } from '@potentiel/domain';
import { sleep } from '../../helpers/sleep';

EtantDonné('un gestionnaire de réseau', async function (this: PotentielWorld, table: DataTable) {
  const exemple = table.rowsHash();

  const codeEIC = exemple['Code EIC'];
  const raisonSociale = exemple['Raison sociale'] ?? 'Une raison sociale';
  const aideSaisieRéférenceDossierRaccordement = {
    format: exemple['Format'],
    légende: exemple['Légende'],
    expressionReguliere: exemple['Expression régulière'],
  };

  await mediator.send<DomainUseCase>({
    type: 'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
    data: {
      identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement,
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
      expressionReguliere: '.',
    };

    await mediator.send<DomainUseCase>({
      type: 'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
      data: {
        identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
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
