import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert, expect } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Document } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';

Alors(`le projet devrait avoir un abandon en cours`, async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: {
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
      },
    });

    assert(Option.isSome(abandon), `Abandon non trouvé !`);
    abandon.demandeEnCours.should.be.equal(true);
  });
});

Alors(`le projet ne devrait plus avoir d'abandon en cours`, async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: {
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
      },
    });

    abandon.should.be.equal(Option.none);
  });
});

Alors(
  /l'abandon du projet lauréat devrait être(.*)demandé/,
  async function (this: PotentielWorld, etat: string) {
    if (etat.includes('de nouveau')) {
      this.lauréatWorld.abandonWorld.reinitialiserEnDemande();
    }

    await waitForExpect(async () =>
      vérifierAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.demandé,
      ),
    );
  },
);

Alors(`l'abandon du projet lauréat devrait être rejeté`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierAbandon.call(
      this,
      this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
      Lauréat.Abandon.StatutAbandon.rejeté,
    ),
  );
});

Alors(`l'abandon du projet lauréat devrait être annulé`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierAbandon.call(
      this,
      this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
      Lauréat.Abandon.StatutAbandon.annulé,
    ),
  );
});

Alors(`l'abandon du projet lauréat devrait être accordé`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierAbandon.call(
      this,
      this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
      Lauréat.Abandon.StatutAbandon.accordé,
    ),
  );
});

Alors(
  `la confirmation d'abandon du projet lauréat devrait être demandée`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.confirmationDemandée,
      ),
    );
  },
);

Alors(`l'abandon du projet lauréat devrait être confirmé`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierAbandon.call(
      this,
      this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
      Lauréat.Abandon.StatutAbandon.confirmé,
    ),
  );
});

Alors(
  `la preuve de recandidature devrait être transmise pour le projet lauréat`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.accordé,
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
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.accordé,
      ),
    );
  },
);

Alors(
  `la demande d'abandon du projet lauréat devrait être en instruction`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.enInstruction,
      ),
    );
  },
);

async function vérifierAbandon(
  this: PotentielWorld,
  identifiantProjet: string,
  statut: Lauréat.Abandon.StatutAbandon.ValueType,
) {
  const abandon = await mediator.send<Lauréat.Abandon.ConsulterDemandeAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterDemandeAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
      demandéLeValue: this.lauréatWorld.abandonWorld.demanderAbandonFixture.demandéLe,
    },
  });

  const actual = mapToPlainObject(abandon);
  const expected = mapToPlainObject(
    this.lauréatWorld.abandonWorld.mapToDemandeAbandonExpected(
      IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut,
    ),
  );

  actual.should.be.deep.equal(expected);

  if (this.lauréatWorld.abandonWorld.demanderAbandonFixture.pièceJustificative) {
    const result = await mediator.send<Document.ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(abandon)
          .some(({ demande: { pièceJustificative } }) => pièceJustificative?.formatter() ?? '')
          .none(() => ''),
      },
    });

    assert(Option.isSome(result), `Pièce justificative non trouvée !`);

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.lauréatWorld.abandonWorld.demanderAbandonFixture.pièceJustificative?.content ??
        new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }

  if (this.lauréatWorld.abandonWorld.accorderAbandonFixture.aÉtéCréé) {
    const result = await mediator.send<Document.ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(abandon)
          .some(({ demande: { accord } }) => accord?.réponseSignée?.formatter() ?? '')
          .none(() => ''),
      },
    });

    assert(Option.isSome(result), `Réponse signée non trouvée !`);

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.lauréatWorld.abandonWorld.accorderAbandonFixture.réponseSignée?.content ??
        new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }

  if (this.lauréatWorld.abandonWorld.rejeterAbandonFixture.aÉtéCréé) {
    const result = await mediator.send<Document.ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(abandon)
          .some(({ demande: { rejet } }) => rejet?.réponseSignée?.formatter() ?? '')
          .none(() => ''),
      },
    });

    assert(Option.isSome(result), `Réponse signée non trouvée !`);

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.lauréatWorld.abandonWorld.rejeterAbandonFixture.réponseSignée?.content ??
        new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }

  if (this.lauréatWorld.abandonWorld.demanderConfirmationAbandonFixture.aÉtéCréé) {
    const result = await mediator.send<Document.ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(abandon)
          .some(({ demande: { confirmation } }) => confirmation?.réponseSignée?.formatter() ?? '')
          .none(() => ''),
      },
    });

    assert(Option.isSome(result), `Réponse signée non trouvée !`);

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.lauréatWorld.abandonWorld.demanderConfirmationAbandonFixture.réponseSignée?.content ??
        new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }
}
