import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Période } from '@potentiel-domain/periode';

import { PotentielWorld } from '../../potentiel.world';

Quand(
  `un DGEC validateur notifie la période d'un appel d'offres`,
  async function (this: PotentielWorld) {
    await notifierPériode.call(this);
  },
);

export async function notifierPériode(this: PotentielWorld) {
  try {
    const identifiantPériode = this.périodeWorld.identifiantPériode.formatter();

    const { lauréats, éliminés } = this.périodeWorld.notifierPériodeFixture.créer({
      notifiéePar: this.utilisateurWorld.validateurFixture.email,
    });

    this.utilisateurWorld.porteurFixture.créer({
      email: this.candidatureWorld.importerCandidature.values.emailContactValue,
    });

    await mediator.send<Période.NotifierPériodeUseCase>({
      type: 'Période.UseCase.NotifierPériode',
      data: {
        identifiantPériodeValue: identifiantPériode,
        notifiéeLeValue: DateTime.convertirEnValueType(
          this.périodeWorld.notifierPériodeFixture.notifiéeLe,
        ).formatter(),
        notifiéeParValue: this.périodeWorld.notifierPériodeFixture.notifiéePar,
        validateurValue: {
          fonction: this.utilisateurWorld.validateurFixture.fonction,
          fullName: this.utilisateurWorld.validateurFixture.nom,
        },
        identifiantCandidatureValues: [...lauréats, ...éliminés],
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
