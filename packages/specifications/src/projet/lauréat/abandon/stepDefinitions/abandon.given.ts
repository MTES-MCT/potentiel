import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

import { PotentielWorld } from '../../../../potentiel.world';
import { importerCandidature } from '../../../../candidature/stepDefinitions/candidature.given';
import { notifierLauréat } from '../../stepDefinitions/lauréat.given';

EtantDonné(
  /une demande d'abandon en cours pour le projet lauréat/,
  async function (this: PotentielWorld) {
    await créerDemandeAbandon.call(this);
  },
);

EtantDonné(
  /une demande d'abandon en cours avec recandidature pour le projet lauréat/,
  async function (this: PotentielWorld) {
    await créerDemandeAbandonAvecRecandidature.call(this);
  },
);

EtantDonné(
  /une demande d'abandon accordée(.*)pour le projet lauréat/,
  async function (this: PotentielWorld, etat: string) {
    const recandidature = etat.includes('avec recandidature');

    if (recandidature) {
      await créerDemandeAbandonAvecRecandidature.call(this);
    } else {
      await créerDemandeAbandon.call(this);
    }
    await créerAccordAbandon.call(this);

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
  /une demande d'abandon rejetée(.*)pour le projet lauréat/,
  async function (this: PotentielWorld, etat: string) {
    if (etat.includes('avec recandidature')) {
      await créerDemandeAbandonAvecRecandidature.call(this);
    } else {
      await créerDemandeAbandon.call(this);
    }
    await créerRejetAbandon.call(this);
  },
);

EtantDonné(
  /une confirmation d'abandon demandée(.*)pour le projet lauréat/,
  async function (this: PotentielWorld, etat: string) {
    if (etat.includes('avec recandidature')) {
      await créerDemandeAbandonAvecRecandidature.call(this);
    } else {
      await créerDemandeAbandon.call(this);
    }
    await créerDemandeConfirmationAbandon.call(this);
  },
);

EtantDonné(
  /une demande d'abandon confirmée(.*)pour le projet lauréat/,
  async function (this: PotentielWorld, etat: string) {
    if (etat.includes('avec recandidature')) {
      await créerDemandeAbandonAvecRecandidature.call(this);
    } else {
      await créerDemandeAbandon.call(this);
    }
    await créerDemandeConfirmationAbandon.call(this);
    await créerConfirmationAbandon.call(this);
  },
);

EtantDonné(
  /une demande d'abandon en instruction(.*)pour le projet lauréat/,
  async function (this: PotentielWorld, etat: string) {
    if (etat.includes('avec recandidature')) {
      await créerDemandeAbandonAvecRecandidature.call(this);
    } else {
      await créerDemandeAbandon.call(this);
    }
    await passerDemandeAbandonEnInstruction.call(this);
  },
);

async function créerDemandeAbandonAvecRecandidature(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { raison, demandéLe, demandéPar, recandidature } =
    this.lauréatWorld.abandonWorld.demanderAbandonFixture.créer({
      identifiantProjet,
      recandidature: true,
      // La date de demande d'abandon avec recandidature est forcément antérieure au 31/03/2025
      demandéLe: faker.date
        .between({
          from: '2025-01-01',
          to: '2025-03-31',
        })
        .toISOString(),
      demandéPar: this.utilisateurWorld.porteurFixture.email,
    });

  // Comme il est désormais impossible de demander un abandon avec recandidature,
  // il faut publier manuellement l'event V1 afin de recréer le cas pour les use case accorder, rejeter et preuve de recandidature
  const event: Lauréat.Abandon.AbandonDemandéEventV1 = {
    type: 'AbandonDemandé-V1',
    payload: {
      identifiantProjet,
      demandéLe: DateTime.convertirEnValueType(demandéLe).formatter(),
      demandéPar,
      raison,
      recandidature,
    },
  };
  await publish(`abandon|${identifiantProjet}`, event);
}

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
  const { demandéLe, recandidature } = this.lauréatWorld.abandonWorld.demanderAbandonFixture;

  const { accordéeLe, accordéePar, réponseSignée } =
    this.lauréatWorld.abandonWorld.accorderAbandonFixture.créer({
      accordéePar: this.utilisateurWorld.validateurFixture.email,
      // dans le contexte d'une recandidature, l'accord a forcément été fait avant le 31/03/2025
      ...(recandidature
        ? { accordéeLe: faker.date.between({ from: demandéLe, to: '2025-03-31' }).toISOString() }
        : {}),
    });

  await mediator.send<Lauréat.Abandon.AbandonUseCase>({
    type: 'Lauréat.Abandon.UseCase.AccorderAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
      réponseSignéeValue: réponseSignée,
      dateAccordValue: accordéeLe,
      identifiantUtilisateurValue: accordéePar,
      rôleUtilisateurValue: this.utilisateurWorld.validateurFixture.role,
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
      rôleUtilisateurValue: this.utilisateurWorld.validateurFixture.role,
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
      dateDemandeDeConfirmationValue: confirmationDemandéeLe,
      identifiantUtilisateurValue: confirmationDemandéePar,
      rôleUtilisateurValue: this.utilisateurWorld.validateurFixture.role,
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
      rôleUtilisateurValue: this.utilisateurWorld.validateurFixture.role,
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

  await mediator.send<Lauréat.Abandon.DemanderPreuveRecandidatureAbandonUseCase>({
    type: 'Lauréat.Abandon.UseCase.DemanderPreuveRecandidatureAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
      dateDemandeValue: demandéeLe,
    },
  });
}

async function créerPreuveRecandidatureTransmise(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const dateDésignation = new Date('2024-01-01').toISOString();

  await importerCandidature.call(this, { statut: 'classé' });
  await notifierLauréat.call(this, dateDésignation);

  const { transmiseLe: dateTransmissionPreuveRecandidature, preuveRecandidature } =
    this.lauréatWorld.abandonWorld.transmettrePreuveRecandidatureAbandonFixture.créer({
      preuveRecandidature: this.candidatureWorld.importerCandidature.identifiantProjet,
    });

  const { accordéePar } = this.lauréatWorld.abandonWorld.accorderAbandonFixture;

  await mediator.send<Lauréat.Abandon.TransmettrePreuveRecandidatureAbandonUseCase>({
    type: 'Lauréat.Abandon.UseCase.TransmettrePreuveRecandidatureAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
      dateTransmissionPreuveRecandidatureValue: dateTransmissionPreuveRecandidature,
      preuveRecandidatureValue: preuveRecandidature,
      identifiantUtilisateurValue: accordéePar,
    },
  });
}
