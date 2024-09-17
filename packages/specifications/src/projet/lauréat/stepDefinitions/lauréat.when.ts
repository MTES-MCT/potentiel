import { mediator } from 'mediateur';
import { When as Quand } from '@cucumber/cucumber';

import { Lauréat } from '@potentiel-domain/laureat';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../potentiel.world';

Quand(
  'le DGEC validateur notifie la candidature comme lauréate',
  async function (this: PotentielWorld) {
    const identifiantProjet = this.candidatureWorld.importerCandidature.identifiantProjet;
    this.lauréatWorld.notifierLauréatFixture.créer({
      identifiantProjet,
    });
    this.utilisateurWorld.porteurFixture.créer({
      email: this.candidatureWorld.importerCandidature.values.emailContactValue,
    });
    await mediator.send<Lauréat.NotifierLauréatUseCase>({
      type: 'Lauréat.UseCase.NotifierLauréat',
      data: {
        identifiantProjetValue: identifiantProjet,
        notifiéLeValue: DateTime.now().formatter(),
        notifiéParValue: this.utilisateurWorld.validateurFixture.email,
        attestationValue: {
          format: `text/plain`,
        },
      },
    });
    const nomProjet = this.candidatureWorld.importerCandidature.values.nomProjetValue;
    this.lauréatWorld.lauréatFixtures.set(nomProjet, {
      appelOffre: this.périodeWorld.identifiantPériode.appelOffre,
      dateDésignation: new Date().toISOString(),
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      nom: nomProjet,
      période: this.périodeWorld.identifiantPériode.période,
    });
  },
);
