import {
  Given as EtantDonné,
  When as Quand,
  Then as Alors,
  DataTable,
  defineParameterType,
} from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';

EtantDonné('un gestionnaire de réseau', async function (this: PotentielWorld, table: DataTable) {
  const exemple = table.rowsHash();

  await this.gestionnaireRéseauWorld.ajouterGestionnaireRéseau({
    codeEIC: exemple['Code EIC'],
    raisonSociale: exemple['Raison sociale'],
  });
});

Quand(
  'un administrateur ajoute un gestionnaire de réseau( avec le même code EIC)',
  async function (this: PotentielWorld, table: DataTable) {
    const example = table.rowsHash();

    try {
      await this.gestionnaireRéseauWorld.ajouterGestionnaireRéseau({
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
  'le gestionnaire de réseau {string} devrait être disponible dans le référenciel des gestionnaires de réseau',
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    await this.gestionnaireRéseauWorld.devraitÊtreDisponibleDansRéférentiel(
      raisonSocialeGestionnaireRéseau,
    );
  },
);

Alors(
  `les détails du gestionnaire de réseau {string} devrait être consultable`,
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    await this.gestionnaireRéseauWorld.devraitÊtreConsultable(raisonSocialeGestionnaireRéseau);
  },
);

defineParameterType({
  name: 'valide-invalide',
  regexp: /valide|invalide/,
  transformer: (s) => s as 'valide' | 'invalide',
});

Alors(
  `pour le gestionnaire de réseau {string} la référence de dossier {string} devrait être {valide-invalide}`,
  async function (
    this: PotentielWorld,
    raisonSocialeGestionnaireRéseau: string,
    référenceÀValider: string,
    résultat: 'valide' | 'invalide',
  ) {
    await this.gestionnaireRéseauWorld.devraitÊtreUnRéférenceValideOuInvalide(
      raisonSocialeGestionnaireRéseau,
      référenceÀValider,
      résultat,
    );
  },
);
