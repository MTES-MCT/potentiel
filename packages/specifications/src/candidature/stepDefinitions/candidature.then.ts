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
import { sleep } from '../../helpers/sleep';

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
        documentKey: candidature.détailsImport.formatter(),
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
  'le porteur a été prévenu que son attestation a été modifiée',
  async function (this: PotentielWorld) {
    const email = this.notificationWorld.récupérerNotification(
      this.candidatureWorld.importerCandidature.values.emailContactValue,
    );

    await waitForExpect(async () => {
      expect(email.messageSubject).match(
        /Potentiel - Une nouvelle attestation est disponible pour le projet .*/,
      );
    });
  },
);

Alors(
  "le porteur n'a pas été prévenu que son attestation a été modifiée",
  async function (this: PotentielWorld) {
    // edge case because we want to wait for a notification that should not be sent
    await sleep(400);
    try {
      this.notificationWorld.récupérerNotification(
        this.candidatureWorld.importerCandidature.values.emailContactValue,
      );
    } catch (error) {
      expect((error as Error).message).to.equal('Pas de notification');
    }
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

Alors(
  "l'attestation de désignation de la candidature devrait être consultable",
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.candidatureWorld.importerCandidature;

    await waitForExpect(async () => {
      const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
        type: 'Candidature.Query.ConsulterCandidature',
        data: {
          identifiantProjet,
        },
      });

      assert(Option.isSome(candidature), 'Candidature non trouvée');

      expect(candidature.notification, "La candidature n'a pas d'attestation").not.to.be.undefined;

      if (candidature.notification?.attestation) {
        const { content, format } = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey: candidature.notification.attestation.formatter(),
          },
        });

        expect(await convertReadableStreamToString(content)).to.have.length.gt(1);
        format.should.be.equal('application/pdf');
      }
    });
  },
);
