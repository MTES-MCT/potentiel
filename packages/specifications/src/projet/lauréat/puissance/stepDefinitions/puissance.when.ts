import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { Puissance } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../potentiel.world';

Quand('la puissance est importée pour le projet', async function (this: PotentielWorld) {
  try {
    await importerPuissance.call(this);
  } catch (error) {
    this.error = error as Error;
  }
});

async function importerPuissance(this: PotentielWorld) {
  const identifiantProjet = this.candidatureWorld.importerCandidature.identifiantProjet;
  const { importéeLe, puissance } = this.lauréatWorld.puissanceWorld.importerPuissanceFixture.créer(
    {
      puissance: this.candidatureWorld.importerCandidature.values.puissanceProductionAnnuelleValue,
    },
  );

  this.lauréatWorld.puissanceWorld.puissance = puissance;

  await mediator.send<Puissance.PuissanceCommand>({
    type: 'Lauréat.Puissance.Command.ImporterPuissance',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      importéeLe: DateTime.convertirEnValueType(importéeLe),
    },
  });
}
