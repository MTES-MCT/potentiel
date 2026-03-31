import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { waitForExpect, expectFileContent } from '#helpers';

import { PotentielWorld } from '../../../../potentiel.world.js';

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

  assert(Option.isSome(demandeAbandon));

  await expectFileContent(
    demandeAbandon.demande.pièceJustificative ?? Option.none,
    this.lauréatWorld.abandonWorld.demanderAbandonFixture.pièceJustificative,
  );

  if (this.lauréatWorld.abandonWorld.accorderAbandonFixture.aÉtéCréé) {
    await expectFileContent(
      demandeAbandon.demande.accord?.réponseSignée ?? Option.none,
      this.lauréatWorld.abandonWorld.accorderAbandonFixture.réponseSignée,
    );
  }

  if (this.lauréatWorld.abandonWorld.rejeterAbandonFixture.aÉtéCréé) {
    await expectFileContent(
      demandeAbandon.demande.rejet?.réponseSignée ?? Option.none,
      this.lauréatWorld.abandonWorld.rejeterAbandonFixture.réponseSignée,
    );
  }

  if (this.lauréatWorld.abandonWorld.demanderConfirmationAbandonFixture.aÉtéCréé) {
    await expectFileContent(
      demandeAbandon.demande.confirmation?.réponseSignée ?? Option.none,
      this.lauréatWorld.abandonWorld.demanderConfirmationAbandonFixture.réponseSignée,
    );
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
