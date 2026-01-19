import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur';

interface Cocontractant extends Utilisateur<'cocontractant'> {
  readonly zone: string;
}

export class CocontractantFixture
  extends AbstractUtilisateur<'cocontractant'>
  implements Cocontractant, Fixture<Cocontractant>
{
  #zone!: string;
  get zone(): string {
    return this.#zone;
  }

  créer(
    partialFixture: Partial<Readonly<Omit<Cocontractant, 'role>'>>> & { zone: string },
  ): Readonly<Cocontractant> {
    const utilisateur = super.créer(partialFixture);

    const cocontractant: Cocontractant = {
      ...utilisateur,
      zone: partialFixture.zone,
    };

    this.#zone = partialFixture.zone;
    return cocontractant;
  }
}
