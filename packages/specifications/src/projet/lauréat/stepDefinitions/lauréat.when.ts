import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../potentiel.world';

Quand(/un administrateur modifie le nom du projet lauréat/, async function (this: PotentielWorld) {
  try {
    const { modifiéLe, modifiéPar, nomProjet, localité } =
      this.lauréatWorld.modifierLauréatFixture.créer({
        modifiéPar: this.utilisateurWorld.adminFixture.email,
      });

    await mediator.send<Lauréat.ModifierLauréatUseCase>({
      type: 'Lauréat.UseCase.ModifierLauréat',
      data: {
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        modifiéParValue: modifiéPar,
        modifiéLeValue: modifiéLe,
        nomProjetValue: nomProjet,
        localité,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
});
