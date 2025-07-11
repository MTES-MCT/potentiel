import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';
import { CréerDemandeDélaiFixture } from '../fixtures/demanderDélai.fixture';

Quand('le porteur demande un délai pour le projet lauréat', async function (this: PotentielWorld) {
  await demanderDélai.call(this, {
    identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
  });
});

export async function demanderDélai(
  this: PotentielWorld,
  partialFixture: CréerDemandeDélaiFixture,
) {
  const { nombreDeMois, raison, pièceJustificative, demandéLe, demandéPar } =
    this.lauréatWorld.délaiWorld.demanderDélaiFixture.créer({ ...partialFixture });

  try {
    await mediator.send<Lauréat.Délai.DemanderDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.DemanderDélai',
      data: {
        identifiantProjetValue: partialFixture.identifiantProjet,
        nombreDeMoisValue: nombreDeMois,
        raisonValue: raison,
        pièceJustificativeValue: pièceJustificative,
        dateDemandeValue: demandéLe,
        identifiantUtilisateurValue: demandéPar,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
