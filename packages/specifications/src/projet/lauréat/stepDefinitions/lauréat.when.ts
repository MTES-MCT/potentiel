import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../potentiel.world';

Quand('un administrateur modifie le projet lauréat', async function (this: PotentielWorld) {
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
        localitéValue: localité,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
});

Quand(
  'un administrateur modifie le projet lauréat sans modification',
  async function (this: PotentielWorld) {
    try {
      const { modifiéLe, modifiéPar, nomProjet, localité } =
        this.lauréatWorld.modifierLauréatFixture.créer({
          localité: this.candidatureWorld.importerCandidature.dépôtValue.localité,
          nomProjet: this.candidatureWorld.importerCandidature.dépôtValue.nomProjet,
          modifiéPar: this.utilisateurWorld.adminFixture.email,
        });

      await mediator.send<Lauréat.ModifierLauréatUseCase>({
        type: 'Lauréat.UseCase.ModifierLauréat',
        data: {
          identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
          modifiéParValue: modifiéPar,
          modifiéLeValue: modifiéLe,
          nomProjetValue: nomProjet,
          localitéValue: localité,
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
