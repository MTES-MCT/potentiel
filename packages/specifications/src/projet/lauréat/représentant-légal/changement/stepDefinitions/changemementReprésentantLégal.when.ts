import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { DateTime, Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../../potentiel.world';
import { CréerDemandeChangementReprésentantLégalFixture } from '../fixtures/demanderChangementReprésentantLégal.fixture';
import { CréerCorrectionChangementReprésentantLégalFixture } from '../fixtures/corrigerChangementReprésentantLégal.fixture';
import { récupérerTâchePlanifiée } from '../../../../../tâche-planifiée/stepDefinitions/tâchePlanifiée.then';

Quand(
  'le porteur demande le changement de représentant pour le projet lauréat',
  async function (this: PotentielWorld) {
    await demanderChangement.call(this, {});
  },
);

Quand(
  'le porteur demande le changement de représentant pour le projet lauréat avec les mêmes valeurs',
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet;
    const { nomReprésentantLégal, typeReprésentantLégal } =
      this.lauréatWorld.représentantLégalWorld.mapToExpected(
        identifiantProjet,
        this.candidatureWorld.importerCandidature.values.nomReprésentantLégalValue,
      );
    await demanderChangement.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      nomReprésentantLégal,
      typeReprésentantLégal,
      demandéPar: this.utilisateurWorld.porteurFixture.email,
    });
  },
);

Quand(
  'le porteur demande le changement de représentant pour le projet lauréat avec un type inconnu',
  async function (this: PotentielWorld) {
    await demanderChangement.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      typeReprésentantLégal:
        Lauréat.ReprésentantLégal.TypeReprésentantLégal.convertirEnValueType('inconnu'),
    });
  },
);

Quand(
  'le porteur demande le changement de représentant pour le projet lauréat le {string}',
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

      await mediator.send<Lauréat.ReprésentantLégal.AnnulerChangementReprésentantLégalUseCase>({
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
  /le porteur corrige la demande de changement de représentant légal pour le projet lauréat/,
  async function (this: PotentielWorld) {
    await corrigerDemandeChangement.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      corrigéPar:
        this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
          .demanderOuEnregistrerChangementReprésentantLégalFixture.demandéPar,
    });
  },
);

Quand(
  /le porteur corrige une demande inexistante de changement de représentant légal pour le projet lauréat/,
  async function (this: PotentielWorld) {
    await corrigerDemandeChangement.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
    });
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

Quand(
  'le porteur enregistre un changement de représentant légal avec les mêmes valeurs',
  async function (this: PotentielWorld) {
    const { nomReprésentantLégal, typeReprésentantLégal } =
      this.lauréatWorld.représentantLégalWorld.mapToExpected(
        this.lauréatWorld.identifiantProjet,
        this.candidatureWorld.importerCandidature.values.nomReprésentantLégalValue,
      );

    await enregistrerChangementReprésentantLégal.call(this, {
      typeReprésentantLégal,
      nomReprésentantLégal,
    });
  },
);

Quand(
  'le porteur enregistre un changement de représentant légal',
  async function (this: PotentielWorld) {
    await enregistrerChangementReprésentantLégal.call(this, {});
  },
);

Quand(
  'le porteur enregistre un changement de représentant légal le {string}',
  async function (this: PotentielWorld, dateDemande: string) {
    await enregistrerChangementReprésentantLégal.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      demandéLe: DateTime.convertirEnValueType(new Date(dateDemande)).formatter(),
    });
  },
);

async function enregistrerChangementReprésentantLégal(
  this: PotentielWorld,
  partialFixture: CréerDemandeChangementReprésentantLégalFixture,
) {
  const { nomReprésentantLégal, typeReprésentantLégal, pièceJustificative, demandéLe, demandéPar } =
    this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.demanderOuEnregistrerChangementReprésentantLégalFixture.créer(
      {
        ...partialFixture,
        statut: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.informationEnregistrée,
      },
    );

  try {
    await mediator.send<Lauréat.ReprésentantLégal.EnregistrerChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.EnregistrerChangementReprésentantLégal',
      data: {
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        nomReprésentantLégalValue: nomReprésentantLégal,
        typeReprésentantLégalValue: typeReprésentantLégal.formatter(),
        pièceJustificativeValue: pièceJustificative,
        dateChangementValue: demandéLe,
        identifiantUtilisateurValue: demandéPar,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

async function demanderChangement(
  this: PotentielWorld,
  partialFixture: CréerDemandeChangementReprésentantLégalFixture,
) {
  const { nomReprésentantLégal, typeReprésentantLégal, pièceJustificative, demandéLe, demandéPar } =
    this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.demanderOuEnregistrerChangementReprésentantLégalFixture.créer(
      { ...partialFixture },
    );

  try {
    await mediator.send<Lauréat.ReprésentantLégal.DemanderChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
      data: {
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
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

async function corrigerDemandeChangement(
  this: PotentielWorld,
  partialFixture: CréerCorrectionChangementReprésentantLégalFixture,
) {
  try {
    const {
      nomReprésentantLégal,
      typeReprésentantLégal,
      pièceJustificative,
      corrigéLe,
      corrigéPar,
    } =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.corrigerChangementReprésentantLégalFixture.créer(
        {
          ...partialFixture,
        },
      );

    await mediator.send<Lauréat.ReprésentantLégal.CorrigerChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.CorrigerChangementReprésentantLégal',
      data: {
        identifiantProjetValue: partialFixture.identifiantProjet,
        nomReprésentantLégalValue: nomReprésentantLégal,
        typeReprésentantLégalValue: typeReprésentantLégal.formatter(),
        pièceJustificativeValue: pièceJustificative,
        dateDemandeValue: this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
          .demanderOuEnregistrerChangementReprésentantLégalFixture.aÉtéCréé
          ? this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
              .demanderOuEnregistrerChangementReprésentantLégalFixture.demandéLe
          : DateTime.now().formatter(),
        dateCorrectionValue: corrigéLe,
        identifiantUtilisateurValue: corrigéPar,
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
                  .demanderOuEnregistrerChangementReprésentantLégalFixture.nomReprésentantLégal,
            },
          );

        await mediator.send<Lauréat.ReprésentantLégal.AccorderChangementReprésentantLégalUseCase>({
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
        this.error = error as Error;
      }
    })
    .with('rejet', async () => {
      try {
        const { rejetéLe, rejetéPar, motif } =
          this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.rejeterChangementReprésentantLégalFixture.créer();

        await mediator.send<Lauréat.ReprésentantLégal.RejeterChangementReprésentantLégalUseCase>({
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
              .demanderOuEnregistrerChangementReprésentantLégalFixture.nomReprésentantLégal,
          typeReprésentantLégal:
            this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
              .demanderOuEnregistrerChangementReprésentantLégalFixture.typeReprésentantLégal,
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

    const tâchePlanifiéeGestion = await récupérerTâchePlanifiée(
      Lauréat.ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal
        .gestionAutomatiqueDemandeChangement.type,
      this.lauréatWorld.identifiantProjet,
    );

    if (!tâchePlanifiéeGestion) {
      throw new Error('Tâche planifiée non trouvée');
    }

    await mediator.send<Lauréat.TâchePlanifiée.ExécuterTâchePlanifiéeUseCase>({
      type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
      data: {
        identifiantProjetValue: identifiantProjet,
        typeTâchePlanifiéeValue: tâchePlanifiéeGestion.typeTâchePlanifiée,
        exécutéeLeValue: DateTime.now().formatter(),
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

async function relancerAutomatiquementDreal(this: PotentielWorld) {
  try {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const tâchePlanifiéeRelanceDreal = await récupérerTâchePlanifiée(
      Lauréat.ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal
        .rappelInstructionÀDeuxMois.type,
      this.lauréatWorld.identifiantProjet,
    );

    if (!tâchePlanifiéeRelanceDreal) {
      throw new Error('Tâche planifiée non trouvée');
    }

    await mediator.send<Lauréat.TâchePlanifiée.ExécuterTâchePlanifiéeUseCase>({
      type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
      data: {
        identifiantProjetValue: identifiantProjet,
        typeTâchePlanifiéeValue: tâchePlanifiéeRelanceDreal.typeTâchePlanifiée,
        exécutéeLeValue: DateTime.now().formatter(),
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
