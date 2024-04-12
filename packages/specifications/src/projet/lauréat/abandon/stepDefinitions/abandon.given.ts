import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Abandon } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

EtantDonné(
  /une demande d'abandon en cours(.*)pour le projet lauréat "(.*)"/,
  async function (this: PotentielWorld, avecRecandidature: string, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de l'accusé de réception`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: avecRecandidature.trim() === 'avec recandidature',
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        identifiantUtilisateurValue: 'porteur@test.test',
      },
    });
  },
);

EtantDonné(
  /un abandon accordé(.*)pour le projet lauréat "(.*)"/,
  async function (this: PotentielWorld, etat: string, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const identifiantProjetValue = identifiantProjet.formatter();
    const recandidature = etat.includes('avec recandidature');
    const preuve = etat.includes('avec preuve transmise');

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
      data: {
        identifiantProjetValue,
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la pièce justificative`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: recandidature,
        dateDemandeValue: DateTime.now().formatter(),
        identifiantUtilisateurValue: 'porteur@test.test',
      },
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.AccorderAbandon',
      data: {
        identifiantProjetValue,
        réponseSignéeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la réponse signée`),
        },
        dateAccordValue: DateTime.convertirEnValueType(new Date()).formatter(),
        identifiantUtilisateurValue: 'validateur@test.test',
      },
    });

    if (recandidature && preuve) {
      const dateMininum = DateTime.convertirEnValueType(new Date('2023-12-15'));

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.TransmettrePreuveRecandidatureAbandon',
        data: {
          identifiantProjetValue,
          dateNotificationValue: (DateTime.now().estAntérieurÀ(dateMininum)
            ? dateMininum
            : DateTime.now()
          ).formatter(),
          preuveRecandidatureValue: IdentifiantProjet.convertirEnValueType(
            'PPE2 - Bâtiment#1##test-51',
          ).formatter(),
          identifiantUtilisateurValue: 'porteur@test.test',
          dateTransmissionPreuveRecandidatureValue: new Date().toISOString(),
        },
      });
    }
  },
);

EtantDonné(
  /un abandon rejeté(.*)pour le projet lauréat "(.*)"/,
  async function (this: PotentielWorld, avecRecandidature: string, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la pièce justificative`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: avecRecandidature.trim() === 'avec recandidature',
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        identifiantUtilisateurValue: 'porteur@test.test',
      },
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.RejeterAbandon',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        réponseSignéeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la réponse signée`),
        },
        dateRejetValue: DateTime.convertirEnValueType(new Date()).formatter(),
        identifiantUtilisateurValue: 'validateur@test.test',
      },
    });
  },
);

EtantDonné(
  /une confirmation d'abandon demandée(.*)pour le projet lauréat "(.*)"/,
  async function (this: PotentielWorld, avecRecandidature: string, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la pièce justificative`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: avecRecandidature.trim() === 'avec recandidature',
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        identifiantUtilisateurValue: 'porteur@test.test',
      },
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.DemanderConfirmationAbandon',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        réponseSignéeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la réponse signée`),
        },
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        identifiantUtilisateurValue: 'validateur@test.test',
      },
    });
  },
);

EtantDonné(
  /un abandon confirmé(.*)pour le projet lauréat "(.*)"/,
  async function (this: PotentielWorld, avecRecandidature: string, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la pièce justificative`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: avecRecandidature.trim() === 'avec recandidature',
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        identifiantUtilisateurValue: 'porteur@test.test',
      },
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.DemanderConfirmationAbandon',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        réponseSignéeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la réponse signée`),
        },
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        identifiantUtilisateurValue: 'validateur@test.test',
      },
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.ConfirmerAbandon',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        dateConfirmationValue: DateTime.convertirEnValueType(new Date()).formatter(),
        identifiantUtilisateurValue: 'porteur@test.test',
      },
    });
  },
);
