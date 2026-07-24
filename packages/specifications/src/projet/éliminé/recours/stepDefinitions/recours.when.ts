import { type DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import type { Éliminé } from '@potentiel-domain/projet';

import { convertFixtureFileToReadableStream } from '#helpers';
import type { PotentielWorld } from '../../../../potentiel.world.js';

Quand(
  `le porteur demande le recours pour le projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      const { identifiantProjet } =
        statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

      const { demandéLe, demandéPar, pièceJustificative, raison } =
        this.éliminéWorld.recoursWorld.demanderRecoursFixture.créer({
          demandéPar: this.utilisateurWorld.porteurFixture.email,
        });

      await mediator.send<Éliminé.Recours.DemanderRecoursUseCase>({
        type: 'Éliminé.Recours.UseCase.DemanderRecours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          raisonValue: raison,
          pièceJustificativeValue: convertFixtureFileToReadableStream(pièceJustificative),
          dateDemandeValue: demandéLe,
          identifiantUtilisateurValue: demandéPar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(`le porteur annule le recours pour le projet éliminé`, async function (this: PotentielWorld) {
  try {
    const { annuléLe: annuléeLe, annuléPar: annuléePar } =
      this.éliminéWorld.recoursWorld.annulerRecoursFixture.créer({
        annuléPar: this.utilisateurWorld.porteurFixture.email,
      });

    await mediator.send<Éliminé.Recours.AnnulerRecoursUseCase>({
      type: 'Éliminé.Recours.UseCase.AnnulerRecours',
      data: {
        identifiantProjetValue: this.éliminéWorld.identifiantProjet.formatter(),
        dateAnnulationValue: annuléeLe,
        identifiantUtilisateurValue: annuléePar,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
});

Quand(`la dgec rejette le recours pour le projet éliminé`, async function (this: PotentielWorld) {
  try {
    const {
      rejetéLe: rejetéeLe,
      rejetéPar: rejetéePar,
      réponseSignée,
    } = this.éliminéWorld.recoursWorld.rejeterRecoursFixture.créer({
      rejetéPar: this.utilisateurWorld.validateurFixture.email,
    });

    await mediator.send<Éliminé.Recours.RejeterRecoursUseCase>({
      type: 'Éliminé.Recours.UseCase.RejeterRecours',
      data: {
        identifiantProjetValue: this.éliminéWorld.identifiantProjet.formatter(),
        dateRejetValue: rejetéeLe,
        réponseSignéeValue: convertFixtureFileToReadableStream(réponseSignée),
        identifiantUtilisateurValue: rejetéePar,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
});

Quand(`la dgec accorde le recours pour le projet éliminé`, async function (this: PotentielWorld) {
  try {
    await accorderRecours.call(this);
  } catch (error) {
    this.error = error as Error;
  }
});

Quand(
  `la dgec accorde le recours pour le projet éliminé avec :`,
  async function (this: PotentielWorld, datatable: DataTable) {
    try {
      const exemple = datatable.rowsHash();

      await accorderRecours.call(
        this,
        exemple["date d'accord du recours"]
          ? DateTime.convertirEnValueType(new Date(exemple["date d'accord du recours"])).formatter()
          : undefined,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  /(.*) dgec passe en instruction le recours pour le projet éliminé/,
  async function (this: PotentielWorld, estLeMêmeOuNouvelAdmin: string) {
    try {
      const estUnNouvelAdmin = estLeMêmeOuNouvelAdmin?.includes('un nouvel utilisateur');
      if (estUnNouvelAdmin) {
        this.utilisateurWorld.dgecFixture.créer();
      }

      const { passéEnInstructionLe, passéEnInstructionPar } =
        this.éliminéWorld.recoursWorld.passerRecoursEnInstructionFixture.créer({
          passéEnInstructionPar: this.utilisateurWorld.dgecFixture.email,
        });

      await mediator.send<Éliminé.Recours.PasserEnInstructionRecoursUseCase>({
        type: 'Éliminé.Recours.UseCase.PasserRecoursEnInstruction',
        data: {
          identifiantProjetValue: this.éliminéWorld.identifiantProjet.formatter(),
          dateInstructionValue: passéEnInstructionLe,
          identifiantUtilisateurValue: passéEnInstructionPar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

export async function accorderRecours(this: PotentielWorld, dateAccordSpécifique?: string) {
  const {
    accordéLe,
    accordéPar: accordéePar,
    dateAccord,
    réponseSignée,
  } = this.éliminéWorld.recoursWorld.accorderRecoursFixture.créer({
    accordéPar: this.utilisateurWorld.validateurFixture.email,
    dateAccordSpécifique,
    dateNotification: this.éliminéWorld.notifierEliminéFixture.notifiéLe,
  });

  await mediator.send<Éliminé.Recours.AccorderRecoursUseCase>({
    type: 'Éliminé.Recours.UseCase.AccorderRecours',
    data: {
      identifiantProjetValue: this.éliminéWorld.identifiantProjet.formatter(),
      dateRéponseSignéeValue: dateAccord,
      accordéLeValue: accordéLe,
      réponseSignéeValue: convertFixtureFileToReadableStream(réponseSignée),
      identifiantUtilisateurValue: accordéePar,
    },
  });

  this.lauréatWorld.notifier({
    identifiantProjet: this.éliminéWorld.identifiantProjet.formatter(),
    notifiéLe: accordéLe,
    notifiéPar: accordéePar,
    localité: this.candidatureWorld.importerCandidature.dépôtValue.localité,
    nomProjet: this.candidatureWorld.importerCandidature.dépôtValue.nomProjet,
  });
}
