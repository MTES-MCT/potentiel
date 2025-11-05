import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Période } from '@potentiel-domain/periode';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';

Quand(
  /.* DGEC validateur notifie la période d'un appel d'offres/,
  async function (this: PotentielWorld) {
    this.notificationWorld.resetNotifications();
    await notifierPériode.call(this);
  },
);

export async function notifierPériode(this: PotentielWorld) {
  try {
    const identifiantPériode = this.périodeWorld.identifiantPériode.formatter();

    const { lauréats, éliminés, notifiéeLe, notifiéePar } =
      this.périodeWorld.notifierPériodeFixture.créer({
        notifiéePar: this.utilisateurWorld.validateurFixture.email,
      });

    const tousProjets = lauréats.concat(éliminés);
    for (const { emailContact } of tousProjets) {
      this.utilisateurWorld.porteurFixture.créer({
        email: emailContact,
      });
    }

    await mediator.send<Période.NotifierPériodeUseCase>({
      type: 'Période.UseCase.NotifierPériode',
      data: {
        identifiantPériodeValue: identifiantPériode,
        notifiéeLeValue: DateTime.convertirEnValueType(notifiéeLe).formatter(),
        notifiéeParValue: notifiéePar,
        validateurValue: {
          fonction: this.utilisateurWorld.validateurFixture.fonction,
          nomComplet: this.utilisateurWorld.validateurFixture.nom,
        },
        identifiantCandidatureValues: tousProjets.map((projet) =>
          IdentifiantProjet.bind(projet).formatter(),
        ),
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
