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

Alors(
  /l'abandon du projet lauréat devrait être(.*)demandé/,
  async function (this: PotentielWorld, etat: string) {
    if (etat.includes('de nouveau')) {
      this.lauréatWorld.abandonWorld.reinitialiserEnDemande();
    }

    await waitForExpect(async () =>
      vérifierDemandeAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.demandé,
      ),
    );

    await waitForExpect(async () =>
      vérifierAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.demandé,
      ),
    );
  },
);

Alors(
  `la demande d'abandon du projet lauréat devrait être rejetée`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierDemandeAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.rejeté,
      ),
    );

    await waitForExpect(async () =>
      vérifierAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.rejeté,
      ),
    );
  },
);

Alors(
  `la demande d'abandon du projet lauréat devrait être annulée`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierDemandeAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.annulé,
      ),
    );

    await waitForExpect(async () =>
      vérifierAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.annulé,
      ),
    );
  },
);

Alors(
  `la demande d'abandon du projet lauréat devrait être accordée`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierDemandeAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.accordé,
      ),
    );

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
  `la demande d'abandon du projet lauréat devrait être en attente de confirmation`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierDemandeAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.confirmationDemandée,
      ),
    );

    await waitForExpect(async () =>
      vérifierAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.confirmationDemandée,
      ),
    );
  },
);

Alors(
  `la demande d'abandon du projet lauréat devrait être confirmée`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierDemandeAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.confirmé,
      ),
    );

    await waitForExpect(async () =>
      vérifierAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.confirmé,
      ),
    );
  },
);

Alors(
  `la preuve de recandidature devrait être transmise pour le projet lauréat`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierDemandeAbandon.call(
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
      vérifierDemandeAbandon.call(
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
      vérifierDemandeAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.enInstruction,
      ),
    );

    await waitForExpect(async () =>
      vérifierAbandon.call(
        this,
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.identifiantProjet,
        Lauréat.Abandon.StatutAbandon.enInstruction,
      ),
    );
  },
);

async function vérifierDemandeAbandon(
  this: PotentielWorld,
  identifiantProjet: string,
  statut: Lauréat.Abandon.StatutAbandon.ValueType,
) {
  const demandeAbandon = await mediator.send<Lauréat.Abandon.ConsulterDemandeAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterDemandeAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
      demandéLeValue: this.lauréatWorld.abandonWorld.demanderAbandonFixture.demandéLe,
    },
  });

  const actual = mapToPlainObject(demandeAbandon);
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
        documentKey: Option.match(demandeAbandon)
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
        documentKey: Option.match(demandeAbandon)
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
        documentKey: Option.match(demandeAbandon)
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
        documentKey: Option.match(demandeAbandon)
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

async function vérifierAbandon(
  this: PotentielWorld,
  identifiantProjet: string,
  statut: Lauréat.Abandon.StatutAbandon.ValueType,
) {
  const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  const actual = mapToPlainObject(abandon);
  const expected = mapToPlainObject(
    this.lauréatWorld.abandonWorld.mapToAbandonExpected(
      IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut,
    ),
  );

  actual.should.be.deep.equal(expected);
}
