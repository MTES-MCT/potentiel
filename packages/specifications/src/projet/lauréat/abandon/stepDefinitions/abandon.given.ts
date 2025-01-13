import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Abandon } from '@potentiel-domain/laureat';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

import { PotentielWorld } from '../../../../potentiel.world';

EtantDonné(
  /une demande d'abandon en cours(.*)pour le projet lauréat/,
  async function (this: PotentielWorld, etat: string) {
    await créerDemandeAbandon.call(this, etat);
  },
);

EtantDonné(
  /un abandon accordé(.*)pour le projet lauréat/,
  async function (this: PotentielWorld, etat: string) {
    await créerDemandeAbandon.call(this, etat);
    await créerAccordAbandon.call(this);

    const recandidature = etat.includes('avec recandidature');

    if (recandidature) {
      await créerDemandePreuveRecandidature.call(this);
    }

    const preuve = etat.includes('avec preuve transmise');

    if (preuve) {
      await créerPreuveRecandidatureTransmise.call(this);
    }
  },
);

EtantDonné(
  /un abandon rejeté(.*)pour le projet lauréat/,
  async function (this: PotentielWorld, etat: string) {
    await créerDemandeAbandon.call(this, etat);
    await créerRejetAbandon.call(this);
  },
);

EtantDonné(
  /une confirmation d'abandon demandée(.*)pour le projet lauréat/,
  async function (this: PotentielWorld, etat: string) {
    await créerDemandeAbandon.call(this, etat);
    await créerDemandeConfirmationAbandon.call(this);
  },
);

EtantDonné(
  /un abandon confirmé(.*)pour le projet lauréat/,
  async function (this: PotentielWorld, etat: string) {
    await créerDemandeAbandon.call(this, etat);
    await créerDemandeConfirmationAbandon.call(this);
    await créerConfirmationAbandon.call(this);
  },
);

async function créerDemandeAbandon(this: PotentielWorld, etat: string) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { raison, demandéLe, demandéPar, pièceJustificative, recandidature } =
    this.lauréatWorld.abandonWorld.demanderAbandonFixture.créer({
      identifiantProjet,
      recandidature: etat.includes('avec recandidature'),
      demandéPar: this.utilisateurWorld.porteurFixture.email,
    });

  // Comme il est désormais impossible de demander un abandon avec recandidature,
  // il faut publier manuellement l'event V1 afin de recréer le cas pour les use case accorder, rejeter et preuve de recandidature
  if (recandidature) {
    const event: Abandon.AbandonDemandéEventV1 = {
      type: 'AbandonDemandé-V1',
      payload: {
        identifiantProjet,
        demandéLe: DateTime.convertirEnValueType(demandéLe).formatter(),
        demandéPar,
        raison,
        pièceJustificative: pièceJustificative && {
          format: pièceJustificative.format,
        },
        recandidature,
      },
    };
    await publish(`abandon|${identifiantProjet}`, event);
  } else if (pièceJustificative) {
    await mediator.send<Abandon.DemanderAbandonUseCase>({
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

  await mediator.send<Abandon.AbandonUseCase>({
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

  await mediator.send<Abandon.AbandonUseCase>({
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

  await mediator.send<Abandon.AbandonUseCase>({
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

  await mediator.send<Abandon.AbandonUseCase>({
    type: 'Lauréat.Abandon.UseCase.ConfirmerAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
      dateConfirmationValue: confirméeLe,
      identifiantUtilisateurValue: confirméePar,
    },
  });
}

async function créerDemandePreuveRecandidature(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { accordéeLe } = this.lauréatWorld.abandonWorld.accorderAbandonFixture;

  const { demandéeLe } =
    this.lauréatWorld.abandonWorld.demanderPreuveCandidatureAbandonFixture.créer({
      demandéeLe: accordéeLe,
    });

  await mediator.send<Abandon.AbandonUseCase>({
    type: 'Lauréat.Abandon.UseCase.DemanderPreuveRecandidatureAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
      dateDemandeValue: demandéeLe,
    },
  });
}

async function créerPreuveRecandidatureTransmise(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { transmiseLe: dateTransmissionPreuveRecandidature, preuveRecandidature } =
    this.lauréatWorld.abandonWorld.transmettrePreuveRecandidatureAbandonFixture.créer();

  const { accordéePar } = this.lauréatWorld.abandonWorld.accorderAbandonFixture;

  // TODO : la date de notification ne doit plus être passée en param. Il faudra charger l'aggregate Lauréat directement dans la commande.
  await mediator.send<Abandon.AbandonUseCase>({
    type: 'Lauréat.Abandon.UseCase.TransmettrePreuveRecandidatureAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
      dateNotificationValue: DateTime.now().formatter(),
      dateTransmissionPreuveRecandidatureValue: dateTransmissionPreuveRecandidature,
      preuveRecandidatureValue: preuveRecandidature,
      identifiantUtilisateurValue: accordéePar,
    },
  });
}
