import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import type { Lauréat } from '@potentiel-domain/projet';

import { waitForExpect } from '#helpers';
import type { PotentielWorld } from '../../../../potentiel.world.js';

EtantDonné(`le projet lauréat avec un état PPA signalé`, async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    await mediator.send<Lauréat.PowerPurchaseAgreement.SignalerPowerPurchaseAgreementUseCase>({
      type: 'Lauréat.PowerPurchaseAgreement.UseCase.SignalerPowerPurchaseAgreement',
      data: {
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        signaléLeValue: new Date().toISOString(),
        signaléParValue: this.utilisateurWorld.dgecFixture.email,
      },
    });
  });
});
