import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Éliminé } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

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

      await mediator.send<Éliminé.Recours.RecoursUseCase>({
        type: 'Éliminé.Recours.UseCase.DemanderRecours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          raisonValue: raison,
          pièceJustificativeValue: pièceJustificative,
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

    await mediator.send<Éliminé.Recours.RecoursUseCase>({
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

Quand(
  `le DGEC validateur rejette le recours pour le projet éliminé`,
  async function (this: PotentielWorld) {
    try {
      const {
        rejetéLe: rejetéeLe,
        rejetéPar: rejetéePar,
        réponseSignée,
      } = this.éliminéWorld.recoursWorld.rejeterRecoursFixture.créer({
        rejetéPar: this.utilisateurWorld.validateurFixture.email,
      });

      await mediator.send<Éliminé.Recours.RecoursUseCase>({
        type: 'Éliminé.Recours.UseCase.RejeterRecours',
        data: {
          identifiantProjetValue: this.éliminéWorld.identifiantProjet.formatter(),
          dateRejetValue: rejetéeLe,
          réponseSignéeValue: réponseSignée,
          identifiantUtilisateurValue: rejetéePar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le DGEC validateur accorde le recours pour le projet éliminé`,
  async function (this: PotentielWorld) {
    try {
      const { identifiantProjet } = this.éliminéWorld;

      const {
        accordéLe: accordéeLe,
        accordéPar: accordéePar,
        réponseSignée,
      } = this.éliminéWorld.recoursWorld.accorderRecoursFixture.créer({
        accordéPar: this.utilisateurWorld.validateurFixture.email,
      });

      this.lauréatWorld.identifiantProjet = identifiantProjet;

      await mediator.send<Éliminé.Recours.RecoursUseCase>({
        type: 'Éliminé.Recours.UseCase.AccorderRecours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateAccordValue: accordéeLe,
          réponseSignéeValue: réponseSignée,
          identifiantUtilisateurValue: accordéePar,
        },
      });

      this.lauréatWorld.notifierLauréatFixture.créer({
        notifiéLe: accordéeLe,
        notifiéPar: accordéePar,
        localité: this.candidatureWorld.importerCandidature.dépôtValue.localité,
        nomProjet: this.candidatureWorld.importerCandidature.dépôtValue.nomProjet,
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  /(.*)administrateur passe en instruction le recours pour le projet éliminé/,
  async function (this: PotentielWorld, estLeMêmeOuNouvelAdmin: string) {
    try {
      const estUnNouvelAdmin = estLeMêmeOuNouvelAdmin?.includes('un nouvel');
      if (estUnNouvelAdmin) {
        this.utilisateurWorld.adminFixture.créer();
      }

      const { passéEnInstructionLe, passéEnInstructionPar } =
        this.éliminéWorld.recoursWorld.passerRecoursEnInstructionFixture.créer({
          passéEnInstructionPar: this.utilisateurWorld.adminFixture.email,
        });

      await mediator.send<Éliminé.Recours.RecoursUseCase>({
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
