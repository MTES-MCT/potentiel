import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../../../potentiel.world.js';
import { expectFileContent } from '../../../../helpers/expectFileContent.js';

Alors(
  /le recours du projet éliminé devrait être(.*)demandé/,
  async function (this: PotentielWorld, etat: string) {
    if (etat.includes('de nouveau')) {
      this.éliminéWorld.recoursWorld.reinitialiserEnDemande();
    }

    await waitForExpect(async () =>
      vérifierRecours.call(
        this,
        this.éliminéWorld.identifiantProjet,
        Éliminé.Recours.StatutRecours.demandé,
      ),
    );
  },
);

Alors(`le recours du projet éliminé devrait être annulé`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierRecours.call(
      this,
      this.éliminéWorld.identifiantProjet,
      Éliminé.Recours.StatutRecours.annulé,
    ),
  );
});

Alors(`le recours du projet éliminé devrait être rejeté`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierRecours.call(
      this,
      this.éliminéWorld.identifiantProjet,
      Éliminé.Recours.StatutRecours.rejeté,
    ),
  );
});

Alors(`le recours du projet éliminé devrait être accordé`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierRecours.call(
      this,
      this.éliminéWorld.identifiantProjet,
      Éliminé.Recours.StatutRecours.accordé,
    ),
  );
});

Alors(
  `la demande de recours du projet éliminé devrait être en instruction`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierRecours.call(
        this,
        this.éliminéWorld.identifiantProjet,
        Éliminé.Recours.StatutRecours.enInstruction,
      ),
    );
  },
);

async function vérifierRecours(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  statut: Éliminé.Recours.StatutRecours.ValueType,
) {
  const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
    type: 'Éliminé.Recours.Query.ConsulterRecours',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });

  const actuelRecours = mapToPlainObject(recours);
  const expectedRecours = mapToPlainObject(
    this.éliminéWorld.recoursWorld.mapToRecoursExpected(identifiantProjet, statut),
  );

  actuelRecours.should.be.deep.equal(expectedRecours);

  const demandeRecours = await mediator.send<Éliminé.Recours.ConsulterDemandeRecoursQuery>({
    type: 'Éliminé.Recours.Query.ConsulterDemandeRecours',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      dateDemandeValue: this.éliminéWorld.recoursWorld.demanderRecoursFixture.demandéLe,
    },
  });

  const actualDemandeRecours = mapToPlainObject(demandeRecours);
  const expectedDemandeRecours = mapToPlainObject(
    this.éliminéWorld.recoursWorld.mapToDemandeRecoursExpected(identifiantProjet, statut),
  );

  actualDemandeRecours.should.be.deep.equal(expectedDemandeRecours);

  assert(Option.isSome(demandeRecours));

  await expectFileContent(
    demandeRecours.demande.pièceJustificative,
    this.éliminéWorld.recoursWorld.demanderRecoursFixture.pièceJustificative,
  );

  if (this.éliminéWorld.recoursWorld.accorderRecoursFixture.aÉtéCréé) {
    assert(demandeRecours.demande.accord, `L'accord de recours est absent`);
    await expectFileContent(
      demandeRecours.demande.accord.réponseSignée,
      this.éliminéWorld.recoursWorld.accorderRecoursFixture.réponseSignée,
    );
  }

  if (this.éliminéWorld.recoursWorld.rejeterRecoursFixture.aÉtéCréé) {
    assert(demandeRecours.demande.rejet, `Le rejet de recours est absent`);
    await expectFileContent(
      demandeRecours.demande.rejet.réponseSignée,
      this.éliminéWorld.recoursWorld.rejeterRecoursFixture.réponseSignée,
    );
  }
}
