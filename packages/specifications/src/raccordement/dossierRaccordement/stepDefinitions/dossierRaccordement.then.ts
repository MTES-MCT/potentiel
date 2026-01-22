import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { expect } from 'chai';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../../potentiel.world.js';

Alors(
  `le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    await waitForExpect(async () => {
      const actual = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actual)) {
        throw new Error('Raccordement inconnu');
      }

      actual.dossiers
        .map((d) => d.référence.formatter())
        .should.contain(this.raccordementWorld.référenceDossier);
    });
  },
);

Alors(
  'le projet lauréat devrait avoir {int} dossiers de raccordement',
  async function (this: PotentielWorld, nombreDeDemandes: number) {
    const { identifiantProjet } = this.lauréatWorld;

    await waitForExpect(async () => {
      const actual = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actual)) {
        throw new Error('Raccordement inconnu');
      }

      actual.dossiers.should.length(nombreDeDemandes);
    });
  },
);

Alors(
  `le dossier ne devrait plus être consultable dans la liste des dossiers du raccordement pour le projet`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await waitForExpect(async () => {
      const raccordementDuProjet =
        await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      if (Option.isNone(raccordementDuProjet)) {
        throw new Error('Raccordement inconnu');
      }

      const dossierCible = raccordementDuProjet.dossiers.find(
        (d) => d.référence.formatter() === référenceDossier,
      );

      expect(dossierCible).to.be.undefined;

      const dossierRaccordement =
        await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossier,
          },
        });

      expect(Option.isNone(dossierRaccordement)).to.be.true;
    });
  },
);

Alors(
  `le dossier de raccordement ne devrait plus être consultable dans le raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } =
      this.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture;
    await waitForExpect(async () => {
      const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      expect(Option.isNone(raccordement)).to.be.true;

      const dossierRaccordement =
        await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossier,
          },
        });

      expect(Option.isNone(dossierRaccordement)).to.be.true;
    });
  },
);

export function vérifierDossierRaccordement(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  dossierRaccordement: Option.Type<Lauréat.Raccordement.ConsulterDossierRaccordementReadModel>,
): asserts dossierRaccordement is Lauréat.Raccordement.ConsulterDossierRaccordementReadModel {
  const { dossier: expectedDossier } = mapToPlainObject(
    this.raccordementWorld.mapToExpected(identifiantProjet),
  );
  const actualDossierRaccordement = mapToPlainObject(dossierRaccordement);

  if (Option.isSome(actualDossierRaccordement)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (actualDossierRaccordement as any).miseÀJourLe;
  }
  actualDossierRaccordement.should.be.deep.equal(
    expectedDossier,
    `le dossier de raccordement n'est pas identique`,
  );
}
