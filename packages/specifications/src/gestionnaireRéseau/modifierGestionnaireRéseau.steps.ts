import { When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';

Quand(
  `un administrateur modifie les données d'un gestionnaire de réseau( inconnu)`,
  async function (this: PotentielWorld, table: DataTable) {
    const example = table.rowsHash();

    try {
      await this.gestionnaireRéseauWorld.modifierGestionnaireRéseau({
        codeEIC: example['Code EIC'],
        raisonSociale: example['Raison sociale'],
        aideSaisieRéférenceDossierRaccordement: {
          format: example['Format'],
          légende: example['Légende'],
          expressionReguliere: example['Expression régulière'],
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Alors(
  `le gestionnaire de réseau {string} devrait être à jour dans le référenciel des gestionnaires de réseau`,
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    await this.gestionnaireRéseauWorld.devraitÊtreDisponibleDansRéférentiel(
      raisonSocialeGestionnaireRéseau,
    );
  },
);

Alors(
  `les détails à jour du gestionnaire de réseau {string} devrait être consultable`,
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    await this.gestionnaireRéseauWorld.devraitÊtreConsultable(raisonSocialeGestionnaireRéseau);
  },
);
