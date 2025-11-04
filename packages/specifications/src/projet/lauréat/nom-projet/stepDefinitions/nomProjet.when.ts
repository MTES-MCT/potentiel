import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

Quand('un administrateur modifie le nom du projet', async function (this: PotentielWorld) {
  try {
    const { misÀJourLe, misÀJourPar, nomProjet } =
      this.lauréatWorld.mettreÀJourNomProjetFixture.créer({
        misÀJourPar: this.utilisateurWorld.adminFixture.email,
      });

    await mediator.send<Lauréat.ModifierNomProjetUseCase>({
      type: 'Lauréat.UseCase.ModifierNomProjet',
      data: {
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        modifiéParValue: misÀJourPar,
        modifiéLeValue: misÀJourLe,
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
      const { misÀJourLe, misÀJourPar, nomProjet } =
        this.lauréatWorld.mettreÀJourNomProjetFixture.créer({
          nomProjet: this.candidatureWorld.importerCandidature.dépôtValue.nomProjet,
          misÀJourPar: this.utilisateurWorld.adminFixture.email,
        });

      await mediator.send<Lauréat.ModifierNomProjetUseCase>({
        type: 'Lauréat.UseCase.ModifierNomProjet',
        data: {
          identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
          modifiéParValue: misÀJourPar,
          modifiéLeValue: misÀJourLe,
          nomProjetValue: nomProjet,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  'un porteur enregistre un changement de nom du projet',
  async function (this: PotentielWorld) {
    try {
      const { misÀJourPar, misÀJourLe, nomProjet } =
        this.lauréatWorld.mettreÀJourNomProjetFixture.créer({
          misÀJourPar: this.utilisateurWorld.porteurFixture.email,
        });

      await mediator.send<Lauréat.EnregistrerChangementNomProjetUseCase>({
        type: 'Lauréat.UseCase.EnregistrerChangementNomProjet',
        data: {
          identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
          enregistréParValue: misÀJourPar,
          enregistréLeValue: misÀJourLe,
          nomProjetValue: nomProjet,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  'un porteur enregistre un changement de nom du projet avec la même valeur',
  async function (this: PotentielWorld) {
    try {
      const { misÀJourPar, misÀJourLe, nomProjet } =
        this.lauréatWorld.mettreÀJourNomProjetFixture.créer({
          misÀJourPar: this.utilisateurWorld.porteurFixture.email,
          nomProjet: this.candidatureWorld.importerCandidature.dépôtValue.nomProjet,
        });

      await mediator.send<Lauréat.EnregistrerChangementNomProjetUseCase>({
        type: 'Lauréat.UseCase.EnregistrerChangementNomProjet',
        data: {
          identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
          enregistréParValue: misÀJourPar,
          enregistréLeValue: misÀJourLe,
          nomProjetValue: nomProjet,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);
