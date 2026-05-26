import { Then as Alors, type DataTable } from '@cucumber/cucumber';
import { assert, expect } from 'chai';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { type IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { waitForExpect } from '#helpers';
import type { PotentielWorld } from '../../potentiel.world.js';
import { récupérerTâchePlanifiée } from '../../tâche-planifiée/stepDefinitions/tâchePlanifiée.then.js';

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

Alors(
  `aucune tâche ou tâche planifiée raccordement n'est consultable pour le projet`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const tâches = await mediator.send<Lauréat.Tâche.ListerTâchesQuery>({
        type: 'Tâche.Query.ListerTâches',
        data: {
          email: this.utilisateurWorld.porteurFixture.email,
        },
      });

      const actualTâches: Lauréat.Tâche.TypeTâche.ValueType[] = tâches.items.map(
        (t) => t.typeTâche,
      );

      const tâchesRaccordement: Lauréat.Tâche.TypeTâche.ValueType[] = [
        Lauréat.Tâche.TypeTâche.raccordementRenseignerAccuséRéceptionDemandeComplèteRaccordement,
        Lauréat.Tâche.TypeTâche.raccordementRéférenceNonTransmise,
        Lauréat.Tâche.TypeTâche.raccordementGestionnaireRéseauInconnuAttribué,
      ];

      const tâchesRaccordementPrésentes = actualTâches.filter((t) =>
        tâchesRaccordement.includes(t),
      );

      expect(tâchesRaccordementPrésentes, 'Des tâches de raccordement sont présentes').to.be.empty;

      const actualTâchePlanifiée = await récupérerTâchePlanifiée(
        Lauréat.Raccordement.TypeTâchePlanifiéeRaccordement.relanceTransmissionDeLaDemandeComplèteRaccordement.formatter(),
        this.lauréatWorld.identifiantProjet,
      );
      expect(actualTâchePlanifiée, 'Une tâche planifiée de raccordement est présente').to.be
        .undefined;
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
