import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { Producteur } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../potentiel.world';

Quand('le producteur est importé pour le projet', async function (this: PotentielWorld) {
  try {
    await importerProducteur.call(this);
  } catch (error) {
    this.error = error as Error;
  }
});

async function importerProducteur(this: PotentielWorld) {
  const identifiantProjet = this.candidatureWorld.importerCandidature.identifiantProjet;
  const { importéLe } = this.lauréatWorld.producteurWorld.importerProducteurFixture.créer({
    producteur: this.candidatureWorld.importerCandidature.values.nomCandidatValue,
  });

  await mediator.send<Producteur.ProducteurCommand>({
    type: 'Lauréat.Producteur.Command.ImporterProducteur',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      importéLe: DateTime.convertirEnValueType(importéLe),
    },
  });
}
