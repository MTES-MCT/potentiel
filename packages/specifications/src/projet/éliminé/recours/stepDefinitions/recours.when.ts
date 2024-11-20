import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Recours } from '@potentiel-domain/elimine';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(
  `le porteur demande le recours pour le projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      const identifiantProjet =
        statutProjet === 'éliminé'
          ? this.eliminéWorld.identifiantProjet.formatter()
          : this.lauréatWorld.identifiantProjet.formatter();

      const { demandéLe, demandéPar, pièceJustificative, raison } =
        this.eliminéWorld.recoursWorld.demanderRecoursFixture.créer({
          demandéPar: this.utilisateurWorld.porteurFixture.email,
        });

      await mediator.send<Recours.RecoursUseCase>({
        type: 'Éliminé.Recours.UseCase.DemanderRecours',
        data: {
          identifiantProjetValue: identifiantProjet,
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
    const identifiantProjet = this.eliminéWorld.identifiantProjet.formatter();

    const { annuléLe: annuléeLe, annuléPar: annuléePar } =
      this.eliminéWorld.recoursWorld.annulerRecoursFixture.créer({
        annuléPar: this.utilisateurWorld.porteurFixture.email,
      });

    await mediator.send<Recours.RecoursUseCase>({
      type: 'Éliminé.Recours.UseCase.AnnulerRecours',
      data: {
        identifiantProjetValue: identifiantProjet,
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
      const identifiantProjet = this.eliminéWorld.identifiantProjet.formatter();

      const {
        rejetéLe: rejetéeLe,
        rejetéPar: rejetéePar,
        réponseSignée,
      } = this.eliminéWorld.recoursWorld.rejeterRecoursFixture.créer({
        rejetéPar: this.utilisateurWorld.validateurFixture.email,
      });

      await mediator.send<Recours.RecoursUseCase>({
        type: 'Éliminé.Recours.UseCase.RejeterRecours',
        data: {
          identifiantProjetValue: identifiantProjet,
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
      const identifiantProjet = this.eliminéWorld.identifiantProjet;
      const nomProjet = this.eliminéWorld.nomProjet;

      const {
        accordéLe: accordéeLe,
        accordéPar: accordéePar,
        réponseSignée,
      } = this.eliminéWorld.recoursWorld.accorderRecoursFixture.créer({
        accordéPar: this.utilisateurWorld.validateurFixture.email,
      });

      this.lauréatWorld.lauréatFixtures.set(nomProjet, {
        nom: nomProjet,
        identifiantProjet,
        dateDésignation: accordéeLe,
        appelOffre: identifiantProjet.appelOffre,
        période: identifiantProjet.période,
      });

      this.lauréatWorld.identifiantProjet = identifiantProjet;

      await mediator.send<Recours.RecoursUseCase>({
        type: 'Éliminé.Recours.UseCase.AccorderRecours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateAccordValue: accordéeLe,
          réponseSignéeValue: réponseSignée,
          identifiantUtilisateurValue: accordéePar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
