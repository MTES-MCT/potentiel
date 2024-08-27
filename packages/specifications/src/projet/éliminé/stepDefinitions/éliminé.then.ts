import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { Éliminé } from '@potentiel-domain/elimine';

import { PotentielWorld } from '../../../potentiel.world';

Alors(
  'le projet éliminé {string} devrait être consultable',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.eliminéWorld.rechercherEliminéFixture(nomProjet);
    const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
      type: 'Éliminé.Query.ConsulterÉliminé',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });
    assert(Option.isSome(éliminé), `Le projet éliminé devrait être trouvé`);
    expect(éliminé.dateDésignation).not.to.be.undefined;
  },
);
