import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';
import waitForExpect from 'wait-for-expect';

import { Option } from '@potentiel-libraries/monads';
import { Éliminé } from '@potentiel-domain/elimine';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../../potentiel.world';
import { convertReadableStreamToString } from '../../../helpers/convertReadableToString';

Alors('le projet éliminé devrait être consultable', async function (this: PotentielWorld) {
  const identifiantProjet = this.eliminéWorld.notifierEliminéFixture.identifiantProjet;
  const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
    type: 'Éliminé.Query.ConsulterÉliminé',
    data: {
      identifiantProjet,
    },
  });
  assert(Option.isSome(éliminé), `Le projet éliminé devrait être trouvé`);
  expect(éliminé.notifiéLe).not.to.be.undefined;
  expect(éliminé.attestation).not.to.be.undefined;

  await waitForExpect(async () => {
    const { content } = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: éliminé.attestation.formatter(),
      },
    });
    expect(await convertReadableStreamToString(content)).to.have.length.gt(1);
  });
});
