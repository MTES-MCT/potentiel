import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(
  "le DGEC validateur modifie l'installateur du projet lauréat",
  async function (this: PotentielWorld) {
    try {
      const { identifiantProjet } = this.lauréatWorld;

      await modifierInstallateur.call(this, identifiantProjet);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le DGEC validateur modifie la typologie du projet lauréat',
  async function (this: PotentielWorld) {
    try {
      const { identifiantProjet } = this.lauréatWorld;
      await modifierTypologieDuProjet.call(this, identifiantProjet);
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
        this.candidatureWorld.importerCandidature.dépôtValue.installateur,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le DGEC validateur modifie la typologie avec une valeur identique pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await modifierTypologieDuProjet.call(
        this,
        this.lauréatWorld.identifiantProjet,
        this.candidatureWorld.importerCandidature.dépôtValue.typologieDuProjet,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le DGEC validateur modifie la typologie du projet avec un jeu de typologies identiques',
  async function (this: PotentielWorld) {
    try {
      await modifierTypologieDuProjet.call(this, this.lauréatWorld.identifiantProjet, [
        { typologie: 'bâtiment.neuf' },
        { typologie: 'bâtiment.neuf' },
      ]);
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
    this.lauréatWorld.installationWorld.modifierInstallateurFixture.créer({
      modifiéPar: this.utilisateurWorld.adminFixture.email,
      ...(installateurValue && { installateur: installateurValue }),
    });

  await mediator.send<Lauréat.Installation.ModifierInstallateurUseCase>({
    type: 'Lauréat.Installation.UseCase.ModifierInstallateur',
    data: {
      installateurValue: installateur,
      dateModificationValue: modifiéLe,
      identifiantUtilisateurValue: modifiéPar,
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });
}

export async function modifierTypologieDuProjet(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  value?: { typologie: string; détails?: string }[],
) {
  const { modifiéeLe, modifiéePar, typologieDuProjet } =
    this.lauréatWorld.installationWorld.modifierTypologieDuProjetFixture.créer({
      modifiéePar: this.utilisateurWorld.adminFixture.email,
      ...(value && { typologieDuProjet: value }),
    });

  await mediator.send<Lauréat.Installation.ModifierTypologieDuProjetUseCase>({
    type: 'Lauréat.Installation.UseCase.ModifierTypologieDuProjet',
    data: {
      typologieDuProjetValue: typologieDuProjet.map((t) =>
        Candidature.TypologieDuProjet.convertirEnValueType(t).formatter(),
      ),
      dateModificationValue: modifiéeLe,
      identifiantUtilisateurValue: modifiéePar,
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });
}
