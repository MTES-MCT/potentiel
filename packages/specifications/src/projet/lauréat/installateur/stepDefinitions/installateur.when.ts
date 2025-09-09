import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(
  "le DGEC validateur modifie l'installateur du projet {lauréat-éliminé}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      const { identifiantProjet } =
        statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

      await modifierInstallateur.call(this, identifiantProjet);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le DGEC validateur modifie l'installateur avec une valeur identique pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await modifierInstallateur.call(
        this,
        this.lauréatWorld.identifiantProjet,
        this.candidatureWorld.importerCandidature.values['nomCandidatValue'],
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

export async function modifierInstallateur(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  installateurValue?: string,
) {
  const { modifiéLe, modifiéPar, installateur } =
    this.lauréatWorld.installateurWorld.modifierInstallateurFixture.créer({
      modifiéPar: this.utilisateurWorld.adminFixture.email,
      ...(installateurValue && { installateur: installateurValue }),
    });

  await mediator.send<Lauréat.Installateur.ModifierInstallateurUseCase>({
    type: 'Lauréat.Installateur.UseCase.ModifierInstallateur',
    data: {
      installateurValue: installateur,
      dateModificationValue: modifiéLe,
      identifiantUtilisateurValue: modifiéPar,
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });
}
