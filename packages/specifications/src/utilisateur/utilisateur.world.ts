import { PorteurFixture } from './fixtures/porteur.fixture';
import { ValidateurFixture } from './fixtures/validateur.fixture';
import { DREALFixture } from './fixtures/dreal.fixture';
import { AdminFixture } from './fixtures/admin.fixture';
import { SystemFixture } from './fixtures/system.fixture';
import { GRDFixture } from './fixtures/grd.fixture';
import { InviterUtilisateurFixture } from './fixtures/inviter/inviter.fixture';
import { RéclamerProjetFixture } from './fixtures/réclamer/réclamerProjet.fixture';

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
  #grdFixture: GRDFixture;

  get grdFixture() {
    return this.#grdFixture;
  }

  #adminFixture: AdminFixture;

  get adminFixture() {
    return this.#adminFixture;
  }

  #systemFixture: SystemFixture;

  get systemFixture() {
    return this.#systemFixture;
  }

  #inviterUtilisateur: InviterUtilisateurFixture;

  get inviterUtilisateur() {
    return this.#inviterUtilisateur;
  }

  #réclamerProjet: RéclamerProjetFixture;

  get réclamerProjet() {
    return this.#réclamerProjet;
  }

  constructor() {
    this.#porteurFixture = new PorteurFixture();
    this.#validateurFixture = new ValidateurFixture();
    this.#drealFixture = new DREALFixture();
    this.#grdFixture = new GRDFixture();
    this.#adminFixture = new AdminFixture();
    this.#systemFixture = new SystemFixture();
    this.#inviterUtilisateur = new InviterUtilisateurFixture();
    this.#réclamerProjet = new RéclamerProjetFixture();
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
      case 'system':
        return this.systemFixture.email;
      default:
        throw new Error(`La fixture ${role} n'a pas été créée`);
    }
  }

  mapToExpected() {
    if (this.réclamerProjet.aÉtéCréé) {
      return this.réclamerProjet.mapToExpected();
    }
    return this.inviterUtilisateur.mapToExpected();
  }
}
