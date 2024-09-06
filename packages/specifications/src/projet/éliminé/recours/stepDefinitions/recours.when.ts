import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Recours } from '@potentiel-domain/elimine';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(
  `le porteur demande le recours pour le projet éliminé`,
  async function (this: PotentielWorld) {
    try {
      const identifiantProjet = this.eliminéWorld.identifiantProjet.formatter();

      const { demandéLe, demandéPar, pièceJustificative, raison } =
        this.eliminéWorld.recoursWorld.demanderRecoursFixture.créer({
          demandéPar: this.utilisateurWorld.porteurFixture.email,
        });

      await mediator.send<Recours.RecoursUseCase>({
        type: 'Eliminé.Recours.UseCase.DemanderRecours',
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

    const { annuléeLe, annuléePar } = this.eliminéWorld.recoursWorld.annulerRecoursFixture.créer({
      annuléePar: this.utilisateurWorld.porteurFixture.email,
    });

    await mediator.send<Recours.RecoursUseCase>({
      type: 'Eliminé.Recours.UseCase.AnnulerRecours',
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

      const { rejetéeLe, rejetéePar, réponseSignée } =
        this.eliminéWorld.recoursWorld.rejeterRecoursFixture.créer({
          rejetéePar: this.utilisateurWorld.validateurFixture.email,
        });

      await mediator.send<Recours.RecoursUseCase>({
        type: 'Eliminé.Recours.UseCase.RejeterRecours',
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
      const identifiantProjet = this.eliminéWorld.identifiantProjet.formatter();

      const { accordéeLe, accordéePar, réponseSignée } =
        this.eliminéWorld.recoursWorld.accorderRecoursFixture.créer({
          accordéePar: this.utilisateurWorld.validateurFixture.email,
        });

      await mediator.send<Recours.RecoursUseCase>({
        type: 'Eliminé.Recours.UseCase.AccorderRecours',
        data: {
          identifiantProjetValue: identifiantProjet,
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
