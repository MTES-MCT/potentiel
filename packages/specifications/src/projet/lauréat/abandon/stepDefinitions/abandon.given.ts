import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Abandon } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';
import { createToken } from '../../../../helpers/createToken';

EtantDonné(
  /une demande d'abandon en cours(.*)pour le projet lauréat "(.*)"/,
  async function (this: PotentielWorld, avecRecandidature: string, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const accessToken = createToken({
      email: 'porteur@test.test',
      role: 'le porteur',
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'DEMANDER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identitiantProjetValueType.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de l'accusé de réception`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: avecRecandidature.trim() === 'avec recandidature',
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: accessToken,
      },
    });
  },
);

EtantDonné(
  /un abandon accordé(.*)pour le projet lauréat "(.*)"/,
  async function (this: PotentielWorld, etat: string, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const identifiantProjet = identitiantProjetValueType.formatter();
    const recandidature = etat.includes('avec recandidature');
    const preuve = etat.includes('avec preuve transmise');

    const porteurAccessToken = createToken({
      email: 'porteur@test.test',
      role: 'le porteur',
    });

    const validateurAccessToken = createToken({
      email: 'porteur@test.test',
      role: 'le DGEC validateur',
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'DEMANDER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identifiantProjet,
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la pièce justificative`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: recandidature,
        dateDemandeValue: DateTime.now().formatter(),
        utilisateurValue: porteurAccessToken,
      },
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'ACCORDER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identifiantProjet,
        réponseSignéeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la réponse signée`),
        },
        dateAccordValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: validateurAccessToken,
      },
    });

    if (recandidature && preuve) {
      const dateMininum = DateTime.convertirEnValueType(new Date('2023-12-15'));

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identifiantProjet,
          dateNotificationValue: (DateTime.now().estAntérieurÀ(dateMininum)
            ? dateMininum
            : DateTime.now()
          ).formatter(),
          preuveRecandidatureValue: IdentifiantProjet.convertirEnValueType(
            'PPE2 - Bâtiment#1##test-51',
          ).formatter(),
          utilisateurValue: 'porteur@test.test',
        },
      });
    }
  },
);

EtantDonné(
  /un abandon rejeté(.*)pour le projet lauréat "(.*)"/,
  async function (this: PotentielWorld, avecRecandidature: string, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const accessToken = createToken({
      email: 'porteur@test.test',
      role: 'le porteur',
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'DEMANDER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identitiantProjetValueType.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la pièce justificative`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: avecRecandidature.trim() === 'avec recandidature',
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: accessToken,
      },
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'REJETER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identitiantProjetValueType.formatter(),
        réponseSignéeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la réponse signée`),
        },
        dateRejetValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: 'validateur@test.test',
      },
    });
  },
);

EtantDonné(
  /une confirmation d'abandon demandée(.*)pour le projet lauréat "(.*)"/,
  async function (this: PotentielWorld, avecRecandidature: string, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const accessToken = createToken({
      email: 'porteur@test.test',
      role: 'le porteur',
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'DEMANDER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identitiantProjetValueType.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la pièce justificative`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: avecRecandidature.trim() === 'avec recandidature',
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: accessToken,
      },
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'DEMANDER_CONFIRMATION_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identitiantProjetValueType.formatter(),
        réponseSignéeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la réponse signée`),
        },
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: 'validateur@test.test',
      },
    });
  },
);

EtantDonné(
  /un abandon confirmé(.*)pour le projet lauréat "(.*)"/,
  async function (this: PotentielWorld, avecRecandidature: string, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const accessToken = createToken({
      email: 'porteur@test.test',
      role: 'le porteur',
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'DEMANDER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identitiantProjetValueType.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la pièce justificative`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: avecRecandidature.trim() === 'avec recandidature',
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: accessToken,
      },
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'DEMANDER_CONFIRMATION_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identitiantProjetValueType.formatter(),
        réponseSignéeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la réponse signée`),
        },
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: 'validateur@test.test',
      },
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'CONFIRMER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identitiantProjetValueType.formatter(),
        dateConfirmationValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: 'porteur@test.test',
      },
    });
  },
);
