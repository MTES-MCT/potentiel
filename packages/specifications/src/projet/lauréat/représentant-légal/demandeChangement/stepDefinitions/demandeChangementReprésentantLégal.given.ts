import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';

EtantDonné(
  /une demande de changement de représentant légal en cours pour le projet lauréat/,
  async function (this: PotentielWorld) {
    await créerDemandeChangementReprésentantLégal.call(this);
  },
);

export async function créerDemandeChangementReprésentantLégal(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { nomReprésentantLégal, typeReprésentantLégal, pièceJustificative, demandéLe, demandéPar } =
    this.lauréatWorld.représentantLégalWorld.demanderChangementReprésentantLégalFixture.créer({
      identifiantProjet,
    });

  await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
    type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
    data: {
      identifiantProjetValue: identifiantProjet,
      nomReprésentantLégalValue: nomReprésentantLégal,
      typeReprésentantLégalValue: typeReprésentantLégal.formatter(),
      pièceJustificativeValue: pièceJustificative,
      identifiantUtilisateurValue: demandéPar,
      dateDemandeValue: demandéLe,
    },
  });
}
