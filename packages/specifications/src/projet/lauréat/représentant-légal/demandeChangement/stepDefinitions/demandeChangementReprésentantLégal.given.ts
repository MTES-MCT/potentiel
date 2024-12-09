import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';

EtantDonné(
  /une demande de changement de représentant légal en cours pour le projet lauréat/,
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const fixture =
      this.lauréatWorld.représentantLégalWorld.demanderChangementReprésentantLégalFixture.créer({
        identifiantProjet,
      });

    await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
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
