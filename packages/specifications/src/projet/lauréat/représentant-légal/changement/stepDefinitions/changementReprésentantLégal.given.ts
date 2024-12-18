import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';

EtantDonné(
  /une demande de changement de représentant légal en cours pour le projet lauréat/,
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const fixture =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.demanderChangementReprésentantLégalFixture.créer(
        {
          identifiantProjet,
        },
      );

    await mediator.send<ReprésentantLégal.DemanderChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomReprésentantLégalValue: fixture.nomReprésentantLégal,
        typeReprésentantLégalValue: fixture.typeReprésentantLégal.formatter(),
        pièceJustificativeValue: fixture.pièceJustificative,
        identifiantUtilisateurValue: fixture.demandéPar,
        dateDemandeValue: fixture.demandéLe,
      },
    });
  },
);

EtantDonné(
  /une demande de changement de représentant légal acordée pour le projet lauréat/,
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const fixtureDemander =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.demanderChangementReprésentantLégalFixture.créer(
        {
          identifiantProjet,
        },
      );

    await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomReprésentantLégalValue: fixtureDemander.nomReprésentantLégal,
        typeReprésentantLégalValue: fixtureDemander.typeReprésentantLégal.formatter(),
        pièceJustificativeValue: fixtureDemander.pièceJustificative,
        identifiantUtilisateurValue: fixtureDemander.demandéPar,
        dateDemandeValue: fixtureDemander.demandéLe,
      },
    });

    const fixtureAccorder =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.accorderChangementReprésentantLégalFixture.créer();

    await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomReprésentantLégalValue: fixtureAccorder.nomReprésentantLégal,
        typeReprésentantLégalValue: fixtureAccorder.typeReprésentantLégal.formatter(),
        identifiantUtilisateurValue: fixtureAccorder.accordéePar,
        dateAccordValue: fixtureAccorder.accordéeLe,
        réponseSignéeValue: fixtureAccorder.réponseSignée,
      },
    });
  },
);
