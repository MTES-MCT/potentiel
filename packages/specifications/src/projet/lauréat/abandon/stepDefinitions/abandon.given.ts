import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

EtantDonné(
  /une demande d'abandon en cours pour le projet lauréat/,
  async function (this: PotentielWorld) {
    await créerDemandeAbandon.call(this);
  },
);

EtantDonné(/un abandon accordé pour le projet lauréat/, async function (this: PotentielWorld) {
  await créerDemandeAbandon.call(this);
  await créerAccordAbandon.call(this);
});

EtantDonné(/un abandon rejeté pour le projet lauréat/, async function (this: PotentielWorld) {
  await créerDemandeAbandon.call(this);
  await créerRejetAbandon.call(this);
});

EtantDonné(
  /une confirmation d'abandon demandée pour le projet lauréat/,
  async function (this: PotentielWorld) {
    await créerDemandeAbandon.call(this);
    await créerDemandeConfirmationAbandon.call(this);
  },
);

EtantDonné(/un abandon confirmé pour le projet lauréat/, async function (this: PotentielWorld) {
  await créerDemandeAbandon.call(this);
  await créerDemandeConfirmationAbandon.call(this);
  await créerConfirmationAbandon.call(this);
});

EtantDonné(
  /une demande d'abandon en instruction pour le projet lauréat/,
  async function (this: PotentielWorld) {
    await créerDemandeAbandon.call(this);
    await passerDemandeAbandonEnInstruction.call(this);
  },
);

async function créerDemandeAbandon(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { raison, demandéLe, demandéPar, pièceJustificative } =
    this.lauréatWorld.abandonWorld.demanderAbandonFixture.créer({
      identifiantProjet,
      demandéPar: this.utilisateurWorld.porteurFixture.email,
    });

  if (pièceJustificative) {
    await mediator.send<Lauréat.Abandon.DemanderAbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
        pièceJustificativeValue: pièceJustificative,
        raisonValue: raison,
        dateDemandeValue: demandéLe,
        identifiantUtilisateurValue: demandéPar,
      },
    });
  } else {
    throw new Error('FIXTURE : La pièce justificative est désormais obligatoire');
  }
}

async function créerAccordAbandon(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { accordéeLe, accordéePar, réponseSignée } =
    this.lauréatWorld.abandonWorld.accorderAbandonFixture.créer({
      accordéePar: this.utilisateurWorld.validateurFixture.email,
    });

  await mediator.send<Lauréat.Abandon.AbandonUseCase>({
    type: 'Lauréat.Abandon.UseCase.AccorderAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
      réponseSignéeValue: réponseSignée,
      dateAccordValue: accordéeLe,
      identifiantUtilisateurValue: accordéePar,
    },
  });
}

async function créerRejetAbandon(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();
  const { rejetéeLe, rejetéePar, réponseSignée } =
    this.lauréatWorld.abandonWorld.rejeterAbandonFixture.créer({
      rejetéePar: this.utilisateurWorld.validateurFixture.email,
    });

  await mediator.send<Lauréat.Abandon.RejeterAbandonUseCase>({
    type: 'Lauréat.Abandon.UseCase.RejeterAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
      réponseSignéeValue: réponseSignée,
      dateRejetValue: rejetéeLe,
      identifiantUtilisateurValue: rejetéePar,
    },
  });
}

async function créerDemandeConfirmationAbandon(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();
  const { confirmationDemandéeLe, confirmationDemandéePar, réponseSignée } =
    this.lauréatWorld.abandonWorld.demanderConfirmationAbandonFixture.créer({
      confirmationDemandéePar: this.utilisateurWorld.validateurFixture.email,
    });

  await mediator.send<Lauréat.Abandon.DemanderConfirmationAbandonUseCase>({
    type: 'Lauréat.Abandon.UseCase.DemanderConfirmationAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
      réponseSignéeValue: réponseSignée,
      dateDemandeValue: confirmationDemandéeLe,
      identifiantUtilisateurValue: confirmationDemandéePar,
    },
  });
}

async function créerConfirmationAbandon(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();
  const { confirméeLe, confirméePar } =
    this.lauréatWorld.abandonWorld.confirmerAbandonFixture.créer();

  await mediator.send<Lauréat.Abandon.ConfirmerAbandonUseCase>({
    type: 'Lauréat.Abandon.UseCase.ConfirmerAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
      dateConfirmationValue: confirméeLe,
      identifiantUtilisateurValue: confirméePar,
    },
  });
}

async function passerDemandeAbandonEnInstruction(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();
  const { passéEnInstructionLe, passéEnInstructionPar } =
    this.lauréatWorld.abandonWorld.passerEnInstructionAbandonFixture.créer({
      passéEnInstructionPar: this.utilisateurWorld.adminFixture.email,
    });

  await mediator.send<Lauréat.Abandon.PasserEnInstructionAbandonUseCase>({
    type: 'Lauréat.Abandon.UseCase.PasserAbandonEnInstruction',
    data: {
      identifiantProjetValue: identifiantProjet,
      dateInstructionValue: passéEnInstructionLe,
      identifiantUtilisateurValue: passéEnInstructionPar,
    },
  });
}
