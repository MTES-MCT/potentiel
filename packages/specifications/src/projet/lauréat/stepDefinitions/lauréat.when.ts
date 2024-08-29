import { mediator } from 'mediateur';
import { DataTable, When as Quand } from '@cucumber/cucumber';

import { Lauréat } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../potentiel.world';

Quand(
  'le DGEC validateur notifie comme lauréate la candidature {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    const { identifiantProjet, values } =
      this.candidatureWorld.rechercherCandidatureFixture(nomProjet);
    const dateNotification = new Date(exemple['date notification']).toISOString();
    await mediator.send<Lauréat.NotifierLauréatUseCase>({
      type: 'Lauréat.UseCase.NotifierLauréat',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        notifiéLeValue: dateNotification,
        notifiéParValue: 'dgec-validateur@test.test', // TODO use fixture
        attestationValue: {
          format: `text/plain`,
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
  },
);
