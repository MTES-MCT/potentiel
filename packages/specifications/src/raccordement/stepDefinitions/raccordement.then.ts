import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../potentiel.world.js';

Alors(
  `le raccordement du projet lauréat devrait être en service pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    const { dateMiseEnService } = this.raccordementWorld.dateMiseEnService.transmettreFixture;

    await vérifierMiseEnServiceDansRaccordement({
      identifiantProjet,
      référenceDossier:
        Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(référenceDossier),
      dateMiseEnService: DateTime.convertirEnValueType(dateMiseEnService),
    });
  },
);

Alors(
  `le raccordement du projet lauréat devrait être en service avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateMiseEnService, référenceDossier } =
      this.raccordementWorld.dateMiseEnService.transmettreFixture.mapExempleToFixtureValues(
        dataTable.rowsHash(),
      );

    if (!dateMiseEnService || !référenceDossier) {
      throw new Error(
        `La date de mise en service et la référence du dossier de raccordement doivent être renseignées dans les exemples`,
      );
    }

    await vérifierMiseEnServiceDansRaccordement({
      identifiantProjet,
      référenceDossier:
        Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(référenceDossier),
      dateMiseEnService: DateTime.convertirEnValueType(dateMiseEnService),
    });
  },
);

Alors(
  `il ne devrait pas y avoir de mise en service dans le raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    await waitForExpect(async () => {
      const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      assert(Option.isSome(raccordement), 'Aucun raccordement trouvé pour le projet lauréat');

      expect(raccordement.miseEnService).to.be.undefined;
    });
  },
);

type VérifierMiseEnServiceDansRaccordementProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  référenceDossier: Lauréat.Raccordement.RéférenceDossierRaccordement.ValueType;
  dateMiseEnService: DateTime.ValueType;
};

const vérifierMiseEnServiceDansRaccordement = async ({
  identifiantProjet,
  référenceDossier,
  dateMiseEnService,
}: VérifierMiseEnServiceDansRaccordementProps) => {
  await waitForExpect(async () => {
    const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
      type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

    assert(Option.isSome(raccordement), 'Aucun raccordement trouvé pour le projet lauréat');

    assert(
      raccordement.miseEnService,
      'Aucune mise en service dans le raccordement du projet lauréat',
    );

    expect(
      raccordement.miseEnService.date.formatter(),
      'La date de mise en service ne correspond pas',
    ).to.equal(dateMiseEnService.formatter());

    expect(
      raccordement.miseEnService.référenceDossier.estÉgaleÀ(référenceDossier),
      'La référence du dossier de raccordement ne correspond pas',
    ).to.be.true;
  });
};
