import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';
import { Abandon } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';

Alors(
  /l'abandon du projet lauréat devrait être(.*)demandé/,
  async function (this: PotentielWorld, etat: string) {
    if (etat.includes('de nouveau')) {
      this.lauréatWorld.abandonWorld.reinitialiserEnDemande();
    }

    await waitForExpect(async () =>
      vérifierAbandon.call(
        this,
        this.lauréatWorld.identifiantProjet,
        Abandon.StatutAbandon.demandé,
      ),
    );
  },
);

Alors(`l'abandon du projet lauréat ne devrait plus exister`, async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: {
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
      },
    });

    abandon.should.be.equal(Option.none);
  });
});

Alors(`l'abandon du projet lauréat devrait être rejeté`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierAbandon.call(this, this.lauréatWorld.identifiantProjet, Abandon.StatutAbandon.rejeté),
  );
});

Alors(`l'abandon du projet lauréat devrait être accordé`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierAbandon.call(this, this.lauréatWorld.identifiantProjet, Abandon.StatutAbandon.accordé),
  );
});

Alors(
  `la confirmation d'abandon du projet lauréat devrait être demandée`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierAbandon.call(
        this,
        this.lauréatWorld.identifiantProjet,
        Abandon.StatutAbandon.confirmationDemandée,
      ),
    );
  },
);

Alors(`l'abandon du projet lauréat devrait être confirmé`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierAbandon.call(this, this.lauréatWorld.identifiantProjet, Abandon.StatutAbandon.confirmé),
  );
});

Alors(
  `la preuve de recandidature devrait être transmise pour le projet lauréat`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierAbandon.call(
        this,
        this.lauréatWorld.identifiantProjet,
        Abandon.StatutAbandon.accordé,
      ),
    );
  },
);

Alors(
  `la preuve de recandidature a été demandée au porteur du projet lauréat`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierAbandon.call(
        this,
        this.lauréatWorld.identifiantProjet,
        Abandon.StatutAbandon.accordé,
      ),
    );
  },
);

async function vérifierAbandon(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  statut: Abandon.StatutAbandon.ValueType,
) {
  const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });

  const actual = mapToPlainObject(abandon);
  const expected = mapToPlainObject(
    this.lauréatWorld.abandonWorld.mapToExpected(identifiantProjet, statut),
  );

  actual.should.be.deep.equal(expected);

  if (this.lauréatWorld.abandonWorld.demanderAbandonFixture.pièceJustificative) {
    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(abandon)
          .some(({ demande: { pièceJustificative } }) => pièceJustificative?.formatter() ?? '')
          .none(() => ''),
      },
    });

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.lauréatWorld.abandonWorld.demanderAbandonFixture.pièceJustificative?.content ??
        new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }

  if (this.lauréatWorld.abandonWorld.accorderAbandonFixture.aÉtéCréé) {
    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(abandon)
          .some(({ demande: { accord } }) => accord?.réponseSignée?.formatter() ?? '')
          .none(() => ''),
      },
    });

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.lauréatWorld.abandonWorld.accorderAbandonFixture.réponseSignée?.content ??
        new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }

  if (this.lauréatWorld.abandonWorld.rejeterAbandonFixture.aÉtéCréé) {
    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(abandon)
          .some(({ demande: { rejet } }) => rejet?.réponseSignée?.formatter() ?? '')
          .none(() => ''),
      },
    });

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.lauréatWorld.abandonWorld.rejeterAbandonFixture.réponseSignée?.content ??
        new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }

  if (this.lauréatWorld.abandonWorld.demanderConfirmationAbandonFixture.aÉtéCréé) {
    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(abandon)
          .some(({ demande: { confirmation } }) => confirmation?.réponseSignée?.formatter() ?? '')
          .none(() => ''),
      },
    });

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.lauréatWorld.abandonWorld.demanderConfirmationAbandonFixture.réponseSignée?.content ??
        new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }
}
