import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../potentiel.world';

Alors(
  'le projet lauréat {string} devrait être consultable',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
      type: 'Lauréat.Query.ConsulterLauréat',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });
    assert(Option.isSome(lauréat), 'Le lauréat devrait être trouvé');
    expect(lauréat.notifiéLe).not.to.be.undefined;
    expect(lauréat.attestation).not.to.be.undefined;

    // TODO rétablir après l'ajout de l'attestation
    // const { content } = await mediator.send<ConsulterDocumentProjetQuery>({
    //   type: 'Document.Query.ConsulterDocumentProjet',
    //   data: {
    //     documentKey: lauréat.attestation.formatter(),
    //   },
    // });
    // expect(await convertReadableStreamToString(content)).to.have.length.gt(1);
  },
);
