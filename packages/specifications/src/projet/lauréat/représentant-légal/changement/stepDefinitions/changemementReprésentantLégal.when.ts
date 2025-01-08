import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../../potentiel.world';
import { CréerDemandeChangementReprésentantLégalFixture } from '../fixtures/demanderChangementReprésentantLégal.fixture';

async function demanderChangement(
  this: PotentielWorld,
  partialFixture: CréerDemandeChangementReprésentantLégalFixture,
) {
  const { nomReprésentantLégal, typeReprésentantLégal, pièceJustificative, demandéLe, demandéPar } =
    this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.demanderChangementReprésentantLégalFixture.créer(
      { ...partialFixture },
    );

  try {
    await mediator.send<ReprésentantLégal.DemanderChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
      data: {
        identifiantProjetValue: partialFixture.identifiantProjet,
        nomReprésentantLégalValue: nomReprésentantLégal,
        typeReprésentantLégalValue: typeReprésentantLégal.formatter(),
        pièceJustificativeValue: pièceJustificative,
        dateDemandeValue: demandéLe,
        identifiantUtilisateurValue: demandéPar,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

Quand(
  'le porteur demande le changement de réprésentant pour le projet lauréat',
  async function (this: PotentielWorld) {
    await demanderChangement.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
    });
  },
);

Quand(
  'le porteur demande le changement de réprésentant pour le projet lauréat avec les mêmes valeurs',
  async function (this: PotentielWorld) {
    await demanderChangement.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      nomReprésentantLégal:
        this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture
          .nomReprésentantLégal,
      typeReprésentantLégal:
        this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture
          .typeReprésentantLégal,
      demandéPar: this.utilisateurWorld.porteurFixture.email,
    });
  },
);

Quand(
  'le porteur demande le changement de réprésentant pour le projet lauréat avec un type inconnu',
  async function (this: PotentielWorld) {
    await demanderChangement.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      typeReprésentantLégal:
        ReprésentantLégal.TypeReprésentantLégal.convertirEnValueType('inconnu'),
    });
  },
);

Quand(
  'le porteur demande le changement de réprésentant pour le projet lauréat le {string}',
  async function (this: PotentielWorld, dateDemande: string) {
    await demanderChangement.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      demandéLe: DateTime.convertirEnValueType(new Date(dateDemande)).formatter(),
    });
  },
);

Quand(
  /(le DGEC validateur|la DREAL associée au projet|le système) accorde la demande de changement de représentant légal pour le projet lauréat/,
  async function (
    this: PotentielWorld,
    rôle: 'le DGEC validateur' | 'la DREAL associée au projet' | 'le système',
  ) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const { accordéeLe, accordéePar, nomReprésentantLégal, typeReprésentantLégal } =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.accorderChangementReprésentantLégalFixture.créer();

    try {
      await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantUtilisateurValue: accordéePar,
          nomReprésentantLégalValue: nomReprésentantLégal,
          typeReprésentantLégalValue: typeReprésentantLégal.formatter(),
          dateAccordValue: accordéeLe,
          accordAutomatiqueValue: rôle === 'le système',
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  /(le DGEC validateur|la DREAL associée au projet|le système) rejette la demande de changement de représentant légal pour le projet lauréat/,
  async function (
    this: PotentielWorld,
    rôle: 'le DGEC validateur' | 'la DREAL associée au projet' | 'le système',
  ) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const { rejetéeLe, rejetéePar, motif } =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.rejeterChangementReprésentantLégalFixture.créer();

    try {
      await mediator.send<ReprésentantLégal.RejeterChangementReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantUtilisateurValue: rejetéePar,
          dateRejetValue: rejetéeLe,
          motifRejetValue: motif,
          rejetAutomatiqueValue: rôle === 'le système',
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
