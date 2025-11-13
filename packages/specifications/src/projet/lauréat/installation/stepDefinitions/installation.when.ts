import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';
import { ModifierDispositifDeStockage } from '../fixture/modifierDispositifDeStockage.fixture';
import { mapToExemple } from '../../../../helpers/mapToExemple';
import { dispositifDeStockageExempleMap } from '../../../../candidature/candidature.exempleMap';

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

Quand(
  `un admin modifie le dispositif de stockage du projet lauréat avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const dispositifDeStockage = mapToExemple(exemple, dispositifDeStockageExempleMap);

    try {
      await modifierDispositifDeStockage.call(
        this,
        this.utilisateurWorld.adminFixture.email,
        dispositifDeStockage,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur enregistre un changement d'installateur du projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await enregistrerChangementInstallateur.call(this, this.lauréatWorld.identifiantProjet);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur enregistre un changement d'installateur du projet lauréat avec une valeur identique",
  async function (this: PotentielWorld) {
    try {
      await enregistrerChangementInstallateur.call(
        this,
        this.lauréatWorld.identifiantProjet,
        this.candidatureWorld.importerCandidature.dépôtValue.installateur,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

async function modifierInstallateur(
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

async function modifierDispositifDeStockage(
  this: PotentielWorld,
  modifiéPar: string,
  dispositifDeStockageExemple: Partial<ModifierDispositifDeStockage['dispositifDeStockage']>,
) {
  const { identifiantProjet } = this.lauréatWorld;

  const { dispositifDeStockage, dateModification } =
    this.lauréatWorld.installationWorld.modifierDispositifDeStockageFixture.créer({
      dispositifDeStockage:
        dispositifDeStockageExemple.installationAvecDispositifDeStockage !== undefined
          ? {
              // otherwise typescript does not understand that dispositifDeStockageExemple.dispositifDeStockage is not undefined...
              installationAvecDispositifDeStockage:
                dispositifDeStockageExemple.installationAvecDispositifDeStockage,
              ...dispositifDeStockageExemple,
            }
          : undefined,
    });

  await mediator.send<Lauréat.Installation.ModifierDispositifDeStockageUseCase>({
    type: 'Lauréat.Installation.UseCase.ModifierDispositifDeStockage',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      dispositifDeStockageValue: dispositifDeStockage,
      modifiéLeValue: dateModification,
      modifiéParValue: modifiéPar,
    },
  });
}

async function enregistrerChangementInstallateur(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  installateurValue?: string,
) {
  const { enregistréLe, enregistréPar, installateur, pièceJustificative, raison } =
    this.lauréatWorld.installationWorld.enregistrerChangementInstallateurFixture.créer({
      enregistréPar: this.utilisateurWorld.adminFixture.email,
      ...(installateurValue && { installateur: installateurValue }),
    });

  await mediator.send<Lauréat.Installation.EnregistrerChangementInstallateurUseCase>({
    type: 'Lauréat.Installateur.UseCase.EnregistrerChangement',
    data: {
      installateurValue: installateur,
      dateChangementValue: enregistréLe,
      identifiantUtilisateurValue: enregistréPar,
      identifiantProjetValue: identifiantProjet.formatter(),
      pièceJustificativeValue: pièceJustificative,
      raisonValue: raison,
    },
  });
}
