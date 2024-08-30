import { mediator } from 'mediateur';
import { When as Quand } from '@cucumber/cucumber';

import { Éliminé } from '@potentiel-domain/elimine';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../potentiel.world';

Quand(
  'le DGEC validateur notifie la candidature comme éliminée',
  async function (this: PotentielWorld) {
    const identifiantProjet = this.candidatureWorld.importerCandidature.identifiantProjet;

    this.eliminéWorld.notifierEliminéFixture.créer({
      identifiantProjet,
    });
    this.utilisateurWorld.porteurFixture.créer({
      email: this.candidatureWorld.importerCandidature.values.emailContactValue,
    });

    await mediator.send<Éliminé.NotifierÉliminéUseCase>({
      type: 'Éliminé.UseCase.NotifierÉliminé',
      data: {
        identifiantProjetValue: identifiantProjet,
        notifiéLeValue: DateTime.now().formatter(),
        notifiéParValue: this.utilisateurWorld.validateurFixture.email,
        attestationValue: {
          format: `application/pdf`,
        },
      },
    });
  },
);
