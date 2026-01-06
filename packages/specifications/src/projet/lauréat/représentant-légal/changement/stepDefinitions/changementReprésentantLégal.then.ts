import { Then as Alors } from '@cucumber/cucumber';
import waitForExpect from 'wait-for-expect';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat, Document } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../../potentiel.world';
import { convertReadableStreamToString } from '../../../../../helpers/convertReadableToString';

Alors(
  'le changement enregistré du représentant légal du projet lauréat devrait être consultable',
  async function (this: PotentielWorld) {
    await vérifierDemande.call(this);
  },
);

Alors(
  /une demande de changement de représentant légal du projet lauréat devrait être consultable/,
  async function (this: PotentielWorld) {
    await vérifierDemande.call(this);
  },
);

Alors(
  /la demande corrigée de changement de représentant légal du projet lauréat devrait être consultable/,
  async function (this: PotentielWorld) {
    await vérifierDemande.call(this);
  },
);

Alors(
  'la demande de changement de représentant légal du projet lauréat devrait être consultable',
  async function (this: PotentielWorld) {
    await vérifierInstructionDemande.call(this);
  },
);

Alors(
  'la demande de changement de représentant légal du projet lauréat devrait être consultable automatiquement',
  async function (this: PotentielWorld) {
    await vérifierInstructionAutomatiqueDemande.call(this, 'rejet');
  },
);

Alors(
  'la demande de changement de représentant légal du projet lauréat devrait être consultable automatiquement',
  async function (this: PotentielWorld) {
    await vérifierInstructionAutomatiqueDemande.call(this, 'accord');
  },
);

async function vérifierDemande(this: PotentielWorld) {
  await waitForExpect(async () => {
    const { identifiantProjet } = this.lauréatWorld;

    const demande =
      await mediator.send<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          demandéLe:
            this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
              .demanderOuEnregistrerChangementReprésentantLégalFixture.demandéLe,
        },
      });

    const actual = mapToPlainObject(demande);

    const expected = mapToPlainObject(
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.mapToExpected(
        identifiantProjet,
      ),
    );

    actual.should.be.deep.equal(expected);

    if (Option.isSome(demande)) {
      const result = await mediator.send<Document.ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey: demande.demande.pièceJustificative.formatter(),
        },
      });

      assert(Option.isSome(result), `Pièce justificative non trouvée !`);

      const actualContent = await convertReadableStreamToString(result.content);

      const {
        demanderOuEnregistrerChangementReprésentantLégalFixture,
        corrigerChangementReprésentantLégalFixture,
      } = this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld;

      const expectedContent = await convertReadableStreamToString(
        corrigerChangementReprésentantLégalFixture.aÉtéCréé
          ? corrigerChangementReprésentantLégalFixture.pièceJustificative.content
          : demanderOuEnregistrerChangementReprésentantLégalFixture.pièceJustificative.content,
      );

      actualContent.should.be.equal(expectedContent);
    }
  });
}

async function vérifierInstructionDemande(this: PotentielWorld) {
  await waitForExpect(async () => {
    const { identifiantProjet } = this.lauréatWorld;

    const changement =
      await mediator.send<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          demandéLe:
            this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
              .demanderOuEnregistrerChangementReprésentantLégalFixture.demandéLe,
        },
      });

    const actual = mapToPlainObject(changement);
    const expected = mapToPlainObject(
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.mapToExpected(
        identifiantProjet,
      ),
    );

    actual.should.be.deep.equal(expected);

    const représentantLégal =
      await mediator.send<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    if (Option.isSome(changement) && changement.demande.statut.estDemandé()) {
      expect(Option.isSome(représentantLégal) && représentantLégal.demandeEnCours).to.be.not
        .undefined;
    } else {
      expect(Option.isSome(représentantLégal) && représentantLégal.demandeEnCours).to.be.undefined;
    }
  });
}

async function vérifierInstructionAutomatiqueDemande(
  this: PotentielWorld,
  action: 'accord' | 'rejet',
) {
  return waitForExpect(async () => {
    const { identifiantProjet } = this.lauréatWorld;

    const changement =
      await mediator.send<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          demandéLe:
            this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
              .demanderOuEnregistrerChangementReprésentantLégalFixture.demandéLe,
        },
      });

    assert(Option.isSome(changement), 'Aucune demande de changement de représentant légal trouvée');

    const actual = mapToPlainObject(changement);
    const expected = mapToPlainObject(
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.mapToExpected(
        identifiantProjet,
      ),
    );

    actual.demande.statut.should.be.deep.equal(expected.demande.statut);

    if (action === 'accord') {
      actual.demande.accord?.accordéePar.should.be.deep.equal(expected.demande.accord?.accordéePar);
    } else {
      actual.demande.rejet?.motif.should.be.equal(expected.demande.rejet?.motif);
      actual.demande.rejet?.rejetéePar.should.be.deep.equal(expected.demande.rejet?.rejetéePar);
    }
  });
}
