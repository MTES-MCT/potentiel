import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Recours } from '@potentiel-domain/elimine';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

EtantDonné(
  /un recours en cours(.*)pour le projet éliminé "(.*)"/,
  async function (this: PotentielWorld, avecRecandidature: string, nomProjet: string) {
    const { identifiantProjet } = this.eliminéWorld.rechercherEliminéFixture(nomProjet);

    await mediator.send<Recours.RecoursUseCase>({
      type: 'Eliminé.Recours.UseCase.DemanderRecours',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de l'accusé de réception`),
        },
        raisonValue: `La raison du recours`,
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        identifiantUtilisateurValue: 'porteur@test.test',
      },
    });
  },
);

EtantDonné(
  /un recours accordé pour le projet éliminé "(.*)"/,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.eliminéWorld.rechercherEliminéFixture(nomProjet);

    const identifiantProjetValue = identifiantProjet.formatter();

    await mediator.send<Recours.RecoursUseCase>({
      type: 'Eliminé.Recours.UseCase.DemanderRecours',
      data: {
        identifiantProjetValue,
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la pièce justificative`),
        },
        raisonValue: `La raison du recours`,
        dateDemandeValue: DateTime.now().formatter(),
        identifiantUtilisateurValue: 'porteur@test.test',
      },
    });

    await mediator.send<Recours.RecoursUseCase>({
      type: 'Eliminé.Recours.UseCase.AccorderRecours',
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
  },
);

EtantDonné(
  /un recours rejeté pour le projet éliminé "(.*)"/,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.eliminéWorld.rechercherEliminéFixture(nomProjet);

    await mediator.send<Recours.RecoursUseCase>({
      type: 'Eliminé.Recours.UseCase.DemanderRecours',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        pièceJustificativeValue: {
          format: `text/plain`,
          content: convertStringToReadableStream(`Le contenu de la pièce justificative`),
        },
        raisonValue: `La raison du recours`,
        dateDemandeValue: DateTime.convertirEnValueType(new Date()).formatter(),
        identifiantUtilisateurValue: 'porteur@test.test',
      },
    });

    await mediator.send<Recours.RecoursUseCase>({
      type: 'Eliminé.Recours.UseCase.RejeterRecours',
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
