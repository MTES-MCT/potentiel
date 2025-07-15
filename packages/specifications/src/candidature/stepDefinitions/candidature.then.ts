import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';
import waitForExpect from 'wait-for-expect';

import { Candidature } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../potentiel.world';
import { convertReadableStreamToString } from '../../helpers/convertReadableToString';
import { sleep } from '../../helpers/sleep';

Alors(`la candidature devrait être consultable`, async function (this: PotentielWorld) {
  const { identifiantProjet } = this.candidatureWorld.importerCandidature;

  const expectedDétails =
    this.candidatureWorld.corrigerCandidature.détailsValue ??
    this.candidatureWorld.importerCandidature.détailsValue;

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

    delete actual.notification;
    actual.should.be.deep.equal(expected);

    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: candidature.détailsImport.formatter(),
      },
    });

    assert(Option.isSome(result), `Détails d'import non trouvé`);

    const actualContent = await convertReadableStreamToString(result.content);
    expect(actualContent).to.equal(JSON.stringify(expectedDétails));
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
  "l'attestation de désignation de la candidature devrait être consultable",
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.candidatureWorld.importerCandidature;
    await vérifierAttestationDeDésignation(identifiantProjet);
  },
);

export const vérifierAttestationDeDésignation = async (identifiantProjet: string) => {
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
      const attestation = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey: candidature.notification.attestation.formatter(),
        },
      });
      assert(Option.isSome(attestation), 'Attestation non trouvée');

      expect(await convertReadableStreamToString(attestation.content)).to.have.length.gt(1);
      attestation.format.should.be.equal('application/pdf');
    }
  }, 1000);
};
