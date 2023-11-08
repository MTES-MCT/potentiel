import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Abandon } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

EtantDonné(
  `une demande d'abandon en cours pour le projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'DEMANDER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identitiantProjetValueType.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de l'accusé de réception`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: false,
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: 'porteur@test.test',
      },
    });
  },
);

EtantDonné(
  `un abandon accordé pour le projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'DEMANDER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identitiantProjetValueType.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la pièce justificative`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: false,
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: 'porteur@test.test',
      },
    });

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'ACCORDER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identitiantProjetValueType.formatter(),
        réponseSignéeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la réponse signée`),
        },
        dateAccordValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: 'validateur@test.test',
      },
    });
  },
);

EtantDonné(
  `un abandon rejeté pour le projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'DEMANDER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identitiantProjetValueType.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la pièce justificative`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: false,
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: 'porteur@test.test',
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
  `une confirmation d'abandon demandé pour le projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'DEMANDER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identitiantProjetValueType.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la pièce justificative`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: false,
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: 'porteur@test.test',
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
  `un abandon confirmé pour le projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'DEMANDER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identitiantProjetValueType.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la pièce justificative`),
        },
        raisonValue: `La raison de l'abandon`,
        recandidatureValue: false,
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        utilisateurValue: 'porteur@test.test',
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
