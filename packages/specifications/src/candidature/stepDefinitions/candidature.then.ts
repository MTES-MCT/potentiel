import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';
import waitForExpect from 'wait-for-expect';

import { Candidature } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { Document } from '@potentiel-domain/projet';

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

    const expectedDépôtValue = this.candidatureWorld.corrigerCandidature.aÉtéCréé
      ? this.candidatureWorld.corrigerCandidature.dépôtValue
      : this.candidatureWorld.importerCandidature.dépôtValue;

    // mapToExpected utilise le ValueType Dépôt, donc une erreur dans ce valueType pourrait ne pas être détectée dans ce test.
    // on compare donc aussi les valeurs des champs du dépôt
    shallowCompareObject(expectedDépôtValue, candidature.dépôt.formatter());

    const détailsImport = await mediator.send<Document.ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: candidature.détailsImport.formatter(),
      },
    });

    assert(Option.isSome(détailsImport), `Détails d'import non trouvé`);

    const actualContent = await convertReadableStreamToString(détailsImport.content);
    expect(actualContent).to.equal(JSON.stringify(expectedDétails));
  });
});

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
        const attestation = await mediator.send<Document.ConsulterDocumentProjetQuery>({
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
  },
);

Alors(
  "l'attestation de désignation de la candidature devrait être régénérée",
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.candidatureWorld.importerCandidature;

    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet,
      },
    });

    assert(Option.isSome(candidature), 'Candidature non trouvée');

    const { notifiéLe } =
      this.candidatureWorld.importerCandidature.instructionValue.statut === 'classé'
        ? this.lauréatWorld.notifierLauréatFixture
        : this.éliminéWorld.notifierEliminéFixture;

    assert(candidature.notification?.attestation, "La candidature n'a pas d'attestation");
    expect(new Date(candidature.notification.attestation.dateCréation)).to.be.greaterThan(
      new Date(notifiéLe),
    );
  },
);

Alors(
  "l'attestation de désignation de la candidature ne devrait pas être régénérée",
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.candidatureWorld.importerCandidature;

    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet,
      },
    });

    assert(Option.isSome(candidature), 'Candidature non trouvée');

    const { notifiéLe } =
      this.candidatureWorld.importerCandidature.instructionValue.statut === 'classé'
        ? this.lauréatWorld.notifierLauréatFixture
        : this.éliminéWorld.notifierEliminéFixture;

    expect(candidature.notification?.attestation?.dateCréation).to.eq(notifiéLe);
  },
);

Alors(
  'les informations de constitution des garanties financières ne devraient pas être consultables',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.candidatureWorld.importerCandidature;

    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet,
      },
    });

    assert(Option.isSome(candidature), 'Candidature non trouvée');
    expect(candidature.dépôt.garantiesFinancières?.constitution).to.be.undefined;
  },
);

// effectue une comparaison non stricte pour s'assurer que les propriétés de `expected` sont présentes dans `actual`, avec la bonne valeur
const shallowCompareObject = (
  expected: Record<string, unknown>,
  actual: Record<string, unknown>,
  path?: string,
) => {
  for (const [key, expectedValue] of Object.entries(expected)) {
    const pathToProp = path ? `${path}${key}` : key;
    const actualValue = actual[key];
    if (typeof expectedValue === 'string') {
      assert(typeof actualValue === 'string');
      expect(actualValue.toLowerCase()).to.eq(
        expectedValue.toLowerCase(),
        `La propriété ${pathToProp} n'a pas la bonne valeur`,
      );
    } else if (typeof expectedValue === 'object') {
      if (expectedValue) {
        assert(typeof actualValue === 'object', `La propriété ${pathToProp} n'est pas un objet`);
        shallowCompareObject(
          expectedValue as Record<string, unknown>,
          actualValue as Record<string, unknown>,
          `${pathToProp}.`,
        );
      } else {
        expect(actualValue).to.eq(
          expectedValue,
          `La propriété ${pathToProp} ne devrait pas être définie`,
        );
      }
    } else {
      expect(actualValue).to.eq(
        expectedValue,
        `La propriété ${pathToProp} n'a pas la bonne valeur`,
      );
    }
  }
};
