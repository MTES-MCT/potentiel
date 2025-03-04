import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Abandon } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(/le porteur demande l'abandon pour le projet lauréat/, async function (this: PotentielWorld) {
  try {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const { demandéLe, demandéPar, pièceJustificative, raison } =
      this.lauréatWorld.abandonWorld.demanderAbandonFixture.créer({
        identifiantProjet,
        demandéPar: this.utilisateurWorld.porteurFixture.email,
      });

    if (pièceJustificative) {
      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
          raisonValue: raison,
          pièceJustificativeValue: pièceJustificative,
          dateDemandeValue: demandéLe,
          identifiantUtilisateurValue: demandéPar,
        },
      });
    } else {
      throw new Error('FIXTURE : La pièce justificative est désormais obligatoire');
    }
  } catch (error) {
    this.error = error as Error;
  }
});

Quand(`le porteur annule l'abandon pour le projet lauréat`, async function (this: PotentielWorld) {
  try {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const { annuléeLe, annuléePar } = this.lauréatWorld.abandonWorld.annulerAbandonFixture.créer({
      annuléePar: this.utilisateurWorld.porteurFixture.email,
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.AnnulerAbandon',
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
  `le DGEC validateur rejette l'abandon pour le projet lauréat`,
  async function (this: PotentielWorld) {
    try {
      const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

      const { rejetéeLe, rejetéePar, réponseSignée } =
        this.lauréatWorld.abandonWorld.rejeterAbandonFixture.créer({
          rejetéePar: this.utilisateurWorld.validateurFixture.email,
        });

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.RejeterAbandon',
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
  `le DGEC validateur accorde l'abandon pour le projet lauréat`,
  async function (this: PotentielWorld) {
    try {
      const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

      const { accordéeLe, accordéePar, réponseSignée } =
        this.lauréatWorld.abandonWorld.accorderAbandonFixture.créer();

      if (this.lauréatWorld.abandonWorld.demanderAbandonFixture.recandidature) {
        this.lauréatWorld.abandonWorld.demanderPreuveCandidatureAbandonFixture.créer({
          demandéeLe: accordéeLe,
        });
      }

      await mediator.send<Abandon.AccorderAbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.AccorderAbandon',
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

Quand(
  `le DGEC validateur demande une confirmation d'abandon pour le projet lauréat`,
  async function (this: PotentielWorld) {
    try {
      const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

      const { confirmationDemandéeLe, confirmationDemandéePar, réponseSignée } =
        this.lauréatWorld.abandonWorld.demanderConfirmationAbandonFixture.créer();

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.DemanderConfirmationAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
          dateDemandeValue: confirmationDemandéeLe,
          réponseSignéeValue: réponseSignée,
          identifiantUtilisateurValue: confirmationDemandéePar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le porteur confirme l'abandon pour le projet lauréat`,
  async function (this: PotentielWorld) {
    try {
      const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

      const { confirméeLe, confirméePar } =
        this.lauréatWorld.abandonWorld.confirmerAbandonFixture.créer({
          confirméePar: this.utilisateurWorld.porteurFixture.email,
        });

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.ConfirmerAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
          dateConfirmationValue: confirméeLe,
          identifiantUtilisateurValue: confirméePar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `l'administrateur instruit l'abandon pour le projet lauréat`,
  async function (this: PotentielWorld) {
    try {
      const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

      const { instruitLe, instruitPar } =
        this.lauréatWorld.abandonWorld.instruireAbandonFixture.créer({
          instruitPar: this.utilisateurWorld.adminFixture.email,
        });

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.InstruireAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
          dateInstructionValue: instruitLe,
          identifiantUtilisateurValue: instruitPar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le porteur transmet le projet {lauréat-éliminé} {string} comme preuve de recandidature suite à l'abandon du projet`,
  async function (
    this: PotentielWorld,
    statutProjet: 'lauréat' | 'éliminé',
    nomPreuveRecandidature: string,
  ) {
    try {
      const { identifiantProjet } = this.lauréatWorld.abandonWorld.demanderAbandonFixture;

      const { identifiantProjet: identifiantProjetPreuveRecandidature } =
        statutProjet === 'lauréat'
          ? this.lauréatWorld.rechercherLauréatFixture(nomPreuveRecandidature)
          : this.eliminéWorld.rechercherÉliminéFixture(nomPreuveRecandidature);

      const { transmiseLe, transmisePar, preuveRecandidature } =
        this.lauréatWorld.abandonWorld.transmettrePreuveRecandidatureAbandonFixture.créer({
          transmisePar: this.utilisateurWorld.porteurFixture.email,
          preuveRecandidature: identifiantProjetPreuveRecandidature.formatter(),
        });

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.TransmettrePreuveRecandidatureAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
          preuveRecandidatureValue: preuveRecandidature,
          identifiantUtilisateurValue: transmisePar,
          dateTransmissionPreuveRecandidatureValue: transmiseLe,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  /le DGEC validateur demande au porteur du projet de transmettre une preuve de recandidature(.*)/,
  async function (this: PotentielWorld, dateLimite: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld.abandonWorld.demanderAbandonFixture;

      const { demandéeLe } =
        this.lauréatWorld.abandonWorld.demanderPreuveCandidatureAbandonFixture.créer({
          demandéeLe: dateLimite.includes('01/04/2025')
            ? new Date('2025-04-01').toISOString()
            : new Date().toISOString(),
        });

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.DemanderPreuveRecandidatureAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
          dateDemandeValue: demandéeLe,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
