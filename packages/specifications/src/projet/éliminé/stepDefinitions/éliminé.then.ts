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
    expect(éliminé.notifiéLe).not.to.be.undefined;
    expect(éliminé.attestation).not.to.be.undefined;

    // TODO rétablir après l'ajout de l'attestation
    // const { content } = await mediator.send<ConsulterDocumentProjetQuery>({
    //   type: 'Document.Query.ConsulterDocumentProjet',
    //   data: {
    //     documentKey: éliminé.attestation.formatter(),
    //   },
    // });
    // expect(await convertReadableStreamToString(content)).to.have.length.gt(1);
  },
);
