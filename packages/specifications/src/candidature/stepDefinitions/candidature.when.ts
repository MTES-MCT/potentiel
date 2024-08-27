import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/laureat';
import { Éliminé } from '@potentiel-domain/elimine';

import { PotentielWorld } from '../../potentiel.world';
import { convertStringToReadableStream } from '../../helpers/convertStringToReadable';

import { mapExampleToUseCaseDefaultValues } from './helper';

Quand(
  `un administrateur importe la candidature {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    const { identifiantProjet, values } = mapExampleToUseCaseDefaultValues(nomProjet, exemple);

    try {
      await mediator.send<Candidature.ImporterCandidatureUseCase>({
        type: 'Candidature.UseCase.ImporterCandidature',
        data: {
          ...values,
          importéLe: DateTime.convertirEnValueType(new Date('2024-08-20')).formatter(),
          importéPar: 'admin@test.test',
        },
      });

      this.candidatureWorld.candidatureFixtures.set(nomProjet, {
        nom: nomProjet,
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        values,
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'un administrateur corrige la candidature {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    const { values: data } = mapExampleToUseCaseDefaultValues(nomProjet, exemple);

    try {
      await mediator.send<Candidature.CorrigerCandidatureUseCase>({
        type: 'Candidature.UseCase.CorrigerCandidature',
        data: {
          ...data,
          corrigéLe: DateTime.convertirEnValueType(new Date('2024-08-20')).formatter(),
          corrigéPar: 'admin@test.test',
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'un administrateur notifie la période de la candidature {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    const { identifiantProjet, values } =
      this.candidatureWorld.rechercherCandidatureFixture(nomProjet);
    const dateNotification = new Date(exemple['date notification']).toISOString();
    // TODO à challenger
    if (values.statutValue === 'éliminé') {
      await mediator.send<Éliminé.NotifierÉliminéUseCase>({
        type: 'Éliminé.UseCase.NotifierÉliminé',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateNotificationValue: dateNotification,
          attestationSignéeValue: {
            format: `text/plain`,
            content: convertStringToReadableStream(`Le contenu de l'attestation`),
          },
        },
      });
      this.eliminéWorld.eliminéFixtures.set(nomProjet, {
        dateDésignation: dateNotification,
        identifiantProjet,
        nom: nomProjet,
      });
    } else {
      await mediator.send<Lauréat.NotifierLauréatUseCase>({
        type: 'Lauréat.UseCase.NotifierLauréat',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateNotificationValue: dateNotification,
          attestationSignéeValue: {
            format: `text/plain`,
            content: convertStringToReadableStream(`Le contenu de l'attestation`),
          },
        },
      });
      this.lauréatWorld.lauréatFixtures.set(nomProjet, {
        appelOffre: values.appelOffreValue,
        dateDésignation: dateNotification,
        identifiantProjet,
        nom: nomProjet,
        période: values.périodeValue,
      });
    }
  },
);
