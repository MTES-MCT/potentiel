import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';
import waitForExpect from 'wait-for-expect';

import { Candidature } from '@potentiel-domain/candidature';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../potentiel.world';
import { convertReadableStreamToString } from '../../helpers/convertReadableToString';

Alors(`la candidature devrait être consultable`, async function (this: PotentielWorld) {
  const { identifiantProjet, values: expectedValues } = this.candidatureWorld.importerCandidature;
  await waitForExpect(async () => {
    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet,
      },
    });

    assert(Option.isSome(candidature), 'Candidature non trouvée');

    const actual = mapToPlainObject(candidature);
    const expected = mapToPlainObject(this.candidatureWorld.mapToExpected());

    actual.should.be.deep.equal(expected);

    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: candidature.détails.formatter(),
      },
    });

    const actualContent = await convertReadableStreamToString(result.content);
    expect(actualContent).to.equal(JSON.stringify(expectedValues.détailsValue));
  });
});

Alors(
  'le porteur a été prévenu que sa candidature a été notifiée',
  async function (this: PotentielWorld) {
    const email = this.notificationWorld.récupérerNotification(
      this.candidatureWorld.importerCandidature.values.emailContactValue,
    );

    await waitForExpect(async () => {
      expect(email.messageSubject).match(/Résultats de la .* période de l'appel d'offres .*/);
    });
  },
);

Alors(
  'les candidatures de la période notifiée devraient être notifiées',
  async function (this: PotentielWorld) {
    const { identifiantPériode } = this.périodeWorld;
    const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
      type: 'Candidature.Query.ListerCandidatures',
      data: {
        appelOffre: identifiantPériode.appelOffre,
        période: identifiantPériode.période,
      },
    });
    for (const candidature of candidatures.items) {
      expect(candidature.estNotifiée, "La candidature n'est pas notifiée").to.be.true;
    }
  },
);
