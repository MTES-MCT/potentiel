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
      await modifierTypologieInstallation.call(this, identifiantProjet);
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
      await modifierTypologieInstallation.call(
        this,
        this.lauréatWorld.identifiantProjet,
        this.candidatureWorld.importerCandidature.dépôtValue.typologieInstallation,
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
      await modifierTypologieInstallation.call(this, this.lauréatWorld.identifiantProjet, [
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

export async function modifierTypologieInstallation(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  value?: { typologie: string; détails?: string }[],
) {
  const { modifiéeLe, modifiéePar, typologieInstallation } =
    this.lauréatWorld.installationWorld.modifierTypologieInstallationFixture.créer({
      modifiéePar: this.utilisateurWorld.adminFixture.email,
      ...(value && { typologieInstallation: value }),
    });

  await mediator.send<Lauréat.Installation.ModifierTypologieInstallationUseCase>({
    type: 'Lauréat.Installation.UseCase.ModifierTypologieInstallation',
    data: {
      typologieInstallationValue: typologieInstallation.map((t) =>
        Candidature.TypologieInstallation.convertirEnValueType(t).formatter(),
      ),
      dateModificationValue: modifiéeLe,
      identifiantUtilisateurValue: modifiéePar,
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });
}
