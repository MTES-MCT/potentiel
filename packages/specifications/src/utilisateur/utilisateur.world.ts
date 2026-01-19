import { FieldToExempleMapper, mapToExemple } from '../helpers/mapToExemple';
import { PotentielWorld } from '../potentiel.world';

import { PorteurFixture } from './fixtures/porteur.fixture';
import { ValidateurFixture } from './fixtures/validateur.fixture';
import { DREALFixture } from './fixtures/dreal.fixture';
import { AdminFixture } from './fixtures/admin.fixture';
import { GRDFixture } from './fixtures/grd.fixture';
import {
  InviterUtilisateurFixture,
  InviterUtilisateurProps,
} from './fixtures/inviter/inviter.fixture';
import { CREFixture } from './fixtures/cre.fixture';
import { ModifierRôleUtilisateurFixture } from './fixtures/inviter/modifier.fixture';
import { InviterPorteurFixture } from './fixtures/inviter/inviterPorteur.fixture';
import { CocontractantFixture } from './fixtures/cocontractant.fixture';

export class UtilisateurWorld {
  #porteurFixture: PorteurFixture;

  get porteurFixture() {
    return this.#porteurFixture;
  }

  #validateurFixture: ValidateurFixture;

  get validateurFixture() {
    return this.#validateurFixture;
  }

  #drealFixture: DREALFixture;

  get drealFixture() {
    return this.#drealFixture;
  }

  #cocontractantFixture: CocontractantFixture;

  get cocontractantFixture() {
    return this.#cocontractantFixture;
  }

  #grdFixture: GRDFixture;

  get grdFixture() {
    return this.#grdFixture;
  }

  #adminFixture: AdminFixture;

  get adminFixture() {
    return this.#adminFixture;
  }

  #creFixture: CREFixture;

  get creFixture() {
    return this.#creFixture;
  }

  #inviterUtilisateur: InviterUtilisateurFixture;

  get inviterUtilisateur() {
    return this.#inviterUtilisateur;
  }

  #inviterPorteur: InviterPorteurFixture;

  get inviterPorteur() {
    return this.#inviterPorteur;
  }

  #modifierRôleUtilisateur: ModifierRôleUtilisateurFixture;

  get modifierRôleUtilisateur() {
    return this.#modifierRôleUtilisateur;
  }

  constructor(private readonly potentielWorld: PotentielWorld) {
    this.#porteurFixture = new PorteurFixture('porteur-projet');
    this.#validateurFixture = new ValidateurFixture('dgec-validateur');
    this.#drealFixture = new DREALFixture('dreal');
    this.#cocontractantFixture = new CocontractantFixture('cocontractant');
    this.#grdFixture = new GRDFixture('grd');
    this.#adminFixture = new AdminFixture('admin');
    this.#creFixture = new CREFixture('cre');
    this.#inviterUtilisateur = new InviterUtilisateurFixture();
    this.#inviterPorteur = new InviterPorteurFixture();
    this.#modifierRôleUtilisateur = new ModifierRôleUtilisateurFixture();
  }

  récupérerEmailSelonRôle(role: string): string {
    switch (role) {
      case 'porteur-projet':
      case 'porteur':
        return this.porteurFixture.email;
      case 'dreal':
        return this.drealFixture.email;
      case 'grd':
        return this.grdFixture.email;
      case 'admin':
        return this.adminFixture.email;
      case 'validateur':
        return this.validateurFixture.email;
      case 'cre':
        return this.creFixture.email;
      default:
        throw new Error(`La fixture ${role} n'a pas été créée`);
    }
  }

  mapExempleToFixtureData(exemple: Record<string, string>): InviterUtilisateurProps {
    const map: FieldToExempleMapper<InviterUtilisateurProps> = {
      email: ['email'],
      rôle: ['rôle'],
      fonction: ['fonction'],
      nomComplet: ['nom complet'],
      région: ['région'],
      zone: ['zone'],
      identifiantGestionnaireRéseau: [
        'gestionnaire réseau',
        (raisonSociale) =>
          raisonSociale
            ? this.potentielWorld.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
                raisonSociale,
              ).codeEIC
            : undefined,
      ],
    };
    const data = mapToExemple(exemple, map);
    if (!data.rôle) {
      throw new Error('le champ rôle est requis');
    }
    return {
      ...data,
      rôle: data.rôle,
    };
  }

  mapToExpected() {
    if (this.potentielWorld.accèsWorld.réclamerProjet.aÉtéCréé) {
      return this.potentielWorld.accèsWorld.réclamerProjet.mapToExpected();
    }
    if (this.modifierRôleUtilisateur.aÉtéCréé) {
      return this.modifierRôleUtilisateur.mapToExpected();
    }
    return this.inviterUtilisateur.mapToExpected();
  }
}
