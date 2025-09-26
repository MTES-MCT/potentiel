import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../potentiel.world';

Quand(
  'un administrateur modifie le site de production du projet',
  async function (this: PotentielWorld) {
    try {
      const { modifiéLe, modifiéPar, localité } =
        this.lauréatWorld.modifierSiteDeProductionFixture.créer({
          modifiéPar: this.utilisateurWorld.adminFixture.email,
        });

      await mediator.send<Lauréat.ModifierSiteDeProductionUseCase>({
        type: 'Lauréat.UseCase.ModifierSiteDeProduction',
        data: {
          identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
          modifiéParValue: modifiéPar,
          modifiéLeValue: modifiéLe,
          localitéValue: localité,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  'un administrateur modifie le site de production du projet avec la même valeur',
  async function (this: PotentielWorld) {
    try {
      const { modifiéLe, modifiéPar, localité } =
        this.lauréatWorld.modifierSiteDeProductionFixture.créer({
          localité: this.candidatureWorld.importerCandidature.dépôtValue.localité,
          modifiéPar: this.utilisateurWorld.adminFixture.email,
        });

      await mediator.send<Lauréat.ModifierSiteDeProductionUseCase>({
        type: 'Lauréat.UseCase.ModifierSiteDeProduction',
        data: {
          identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
          modifiéParValue: modifiéPar,
          modifiéLeValue: modifiéLe,
          localitéValue: localité,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

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
Quand(
  'le porteur choisit le cahier des charges {string}',
  async function (this: PotentielWorld, cdcChoisi: string) {
    try {
      await choisirCahierDesCharges.call(this, cdcChoisi);
    } catch (e) {
      this.error = e as Error;
    }
  },
);

export async function choisirCahierDesCharges(this: PotentielWorld, cdcChoisi: string) {
  const { modifiéLe, modifiéPar, cahierDesCharges } =
    this.lauréatWorld.choisirCahierDesChargesFixture.créer({
      cahierDesCharges: cdcChoisi,
      modifiéPar: this.utilisateurWorld.porteurFixture.email,
    });

  await mediator.send<Lauréat.ChoisirCahierDesChargesUseCase>({
    type: 'Lauréat.UseCase.ChoisirCahierDesCharges',
    data: {
      identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
      modifiéParValue: modifiéPar,
      modifiéLeValue: modifiéLe,
      cahierDesChargesValue: cahierDesCharges,
    },
  });
}
