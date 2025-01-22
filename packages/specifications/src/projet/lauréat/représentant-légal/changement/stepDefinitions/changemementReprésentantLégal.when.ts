import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { DateTime, Email } from '@potentiel-domain/common';
import { ExécuterTâchePlanifiéeUseCase } from '@potentiel-domain/tache-planifiee';

import { PotentielWorld } from '../../../../../potentiel.world';
import { CréerDemandeChangementReprésentantLégalFixture } from '../fixtures/demanderChangementReprésentantLégal.fixture';

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
  /le porteur annule la demande de changement de représentant légal pour le projet lauréat/,
  async function (this: PotentielWorld) {
    try {
      const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

      const { annuléLe, annuléPar } =
        this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.annulerChangementReprésentantLégalFixture.créer();

      await mediator.send<ReprésentantLégal.AnnulerChangementReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.AnnulerChangementReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantUtilisateurValue: annuléPar,
          dateAnnulationValue: annuléLe,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  /(le DGEC validateur|la DREAL associée au projet) accorde la demande de changement de représentant légal pour le projet lauréat/,
  async function (this: PotentielWorld, _: 'le DGEC validateur' | 'la DREAL associée au projet') {
    await instruireChangement.call(this, 'accord');
  },
);

Quand(
  /(le DGEC validateur|la DREAL associée au projet) corrige puis accorde la demande de changement de représentant légal pour le projet lauréat/,
  async function (this: PotentielWorld, _: 'le DGEC validateur' | 'la DREAL associée au projet') {
    await instruireChangement.call(this, 'accord', 'Nom de représentant légal corrigé');
  },
);

Quand(
  /(le DGEC validateur|la DREAL associée au projet) rejette la demande de changement de représentant légal pour le projet lauréat/,
  async function (this: PotentielWorld, _: 'le DGEC validateur' | 'la DREAL associée au projet') {
    await instruireChangement.call(this, 'rejet');
  },
);

Quand(
  /le système accorde automatiquement la demande de changement de représentant légal pour le projet lauréat/,
  async function (this: PotentielWorld) {
    await instruireAutomatiquementChangement.call(this, 'accord');
  },
);

Quand(
  /le système rejette automatiquement la demande de changement de représentant légal pour le projet lauréat/,
  async function (this: PotentielWorld) {
    await instruireAutomatiquementChangement.call(this, 'rejet');
  },
);

Quand(
  /le système relance automatiquement la dreal pour faire (l'accord|le rejet) de la demande de changement de représentant légal pour le projet lauréat/,
  async function (this: PotentielWorld, _: "l'accord" | 'le rejet') {
    await relancerAutomatiquementDreal.call(this);
  },
);

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

async function instruireChangement(
  this: PotentielWorld,
  instruction: 'accord' | 'rejet',
  correctionNomReprésentantLégal?: string,
) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  return match(instruction)
    .with('accord', async () => {
      try {
        const { accordéeLe, accordéePar, nomReprésentantLégal, typeReprésentantLégal } =
          this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.accorderChangementReprésentantLégalFixture.créer(
            {
              nomReprésentantLégal:
                correctionNomReprésentantLégal ??
                this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
                  .demanderChangementReprésentantLégalFixture.nomReprésentantLégal,
            },
          );

        await mediator.send<ReprésentantLégal.AccorderChangementReprésentantLégalUseCase>({
          type: 'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
          data: {
            identifiantProjetValue: identifiantProjet,
            identifiantUtilisateurValue: accordéePar,
            nomReprésentantLégalValue: correctionNomReprésentantLégal ?? nomReprésentantLégal,
            typeReprésentantLégalValue: typeReprésentantLégal.formatter(),
            dateAccordValue: accordéeLe,
            accordAutomatiqueValue: false,
          },
        });
      } catch (error) {
        console.log('😐wtf', error);
        this.error = error as Error;
      }
    })
    .with('rejet', async () => {
      try {
        const { rejetéLe, rejetéPar, motif } =
          this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.rejeterChangementReprésentantLégalFixture.créer();

        await mediator.send<ReprésentantLégal.RejeterChangementReprésentantLégalUseCase>({
          type: 'Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal',
          data: {
            identifiantProjetValue: identifiantProjet,
            identifiantUtilisateurValue: rejetéPar,
            dateRejetValue: rejetéLe,
            motifRejetValue: motif,
            rejetAutomatiqueValue: false,
          },
        });
      } catch (error) {
        this.error = error as Error;
      }
    })
    .exhaustive();
}

async function instruireAutomatiquementChangement(
  this: PotentielWorld,
  instruction: 'accord' | 'rejet',
) {
  try {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    if (instruction === 'accord') {
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.accorderChangementReprésentantLégalFixture.créer(
        {
          accordéePar: Email.system().formatter(),
          nomReprésentantLégal:
            this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
              .demanderChangementReprésentantLégalFixture.nomReprésentantLégal,
          typeReprésentantLégal:
            this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
              .demanderChangementReprésentantLégalFixture.typeReprésentantLégal,
        },
      );
    } else {
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.rejeterChangementReprésentantLégalFixture.créer(
        {
          motif: 'Rejet automatique',
          rejetéPar: Email.system().formatter(),
        },
      );
    }

    const tâchePlanifiée = this.tâchePlanifiéeWorld.rechercherTâchePlanifiée(
      'gestion automatique de la demande de changement de représentant légal',
    );

    if (!tâchePlanifiée) {
      throw new Error('Type de tâche planifiée non trouvé');
    }

    const typeTâchePlanifiéeValue = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(
      tâchePlanifiée.typeTâchePlanifiée,
    ).type;

    await mediator.send<ExécuterTâchePlanifiéeUseCase>({
      type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
      data: {
        identifiantProjetValue: identifiantProjet,
        typeTâchePlanifiéeValue,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

async function relancerAutomatiquementDreal(this: PotentielWorld) {
  try {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const tâchePlanifiée = this.tâchePlanifiéeWorld.rechercherTâchePlanifiée(
      "rappel d'instruction de la demande de changement de représentant légal à deux mois",
    );

    const typeTâchePlanifiéeValue = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(
      tâchePlanifiée.typeTâchePlanifiée,
    ).type;

    await mediator.send<ExécuterTâchePlanifiéeUseCase>({
      type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
      data: {
        identifiantProjetValue: identifiantProjet,
        typeTâchePlanifiéeValue,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
