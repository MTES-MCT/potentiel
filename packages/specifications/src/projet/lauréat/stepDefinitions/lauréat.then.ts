import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';
import waitForExpect from 'wait-for-expect';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/laureat';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../../potentiel.world';
import { convertReadableStreamToString } from '../../../helpers/convertReadableToString';

Alors('le projet lauréat devrait être consultable', async function (this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.notifierLauréatFixture.identifiantProjet;
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });
  assert(Option.isSome(lauréat), 'Le lauréat devrait être trouvé');
  expect(lauréat.notifiéLe).not.to.be.undefined;
  expect(lauréat.attestation).not.to.be.undefined;

  await waitForExpect(async () => {
    const { content } = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: lauréat.attestation.formatter(),
      },
    });
    expect(await convertReadableStreamToString(content)).to.have.length.gt(1);
  });
});
