import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../potentiel.world';

Quand('un administrateur modifie le nom du projet', async function (this: PotentielWorld) {
  try {
    const { modifiéLe, modifiéPar, nomProjet } = this.lauréatWorld.modifierNomProjetFixture.créer({
      modifiéPar: this.utilisateurWorld.adminFixture.email,
    });

    await mediator.send<Lauréat.ModifierNomProjetUseCase>({
      type: 'Lauréat.UseCase.ModifierNomProjet',
      data: {
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        modifiéParValue: modifiéPar,
        modifiéLeValue: modifiéLe,
        nomProjetValue: nomProjet,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
});

Quand(
  'un administrateur modifie le nom du projet avec la même valeur',
  async function (this: PotentielWorld) {
    try {
      const { modifiéLe, modifiéPar, nomProjet } = this.lauréatWorld.modifierNomProjetFixture.créer(
        {
          nomProjet: this.candidatureWorld.importerCandidature.dépôtValue.nomProjet,
          modifiéPar: this.utilisateurWorld.adminFixture.email,
        },
      );

      await mediator.send<Lauréat.ModifierNomProjetUseCase>({
        type: 'Lauréat.UseCase.ModifierNomProjet',
        data: {
          identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
          modifiéParValue: modifiéPar,
          modifiéLeValue: modifiéLe,
          nomProjetValue: nomProjet,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);
