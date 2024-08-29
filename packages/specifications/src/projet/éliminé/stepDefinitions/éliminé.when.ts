import { mediator } from 'mediateur';
import { DataTable, When as Quand } from '@cucumber/cucumber';

import { Éliminé } from '@potentiel-domain/elimine';

import { PotentielWorld } from '../../../potentiel.world';

Quand(
  'le DGEC validateur notifie comme éliminée la candidature {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    const { identifiantProjet } = this.candidatureWorld.rechercherCandidatureFixture(nomProjet);
    const dateNotification = new Date(exemple['date notification']).toISOString();
    await mediator.send<Éliminé.NotifierÉliminéUseCase>({
      type: 'Éliminé.UseCase.NotifierÉliminé',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        notifiéLeValue: dateNotification,
        notifiéParValue: 'dgec-validateur@test.test', // TODO use fixture
        attestationValue: {
          format: `text/plain`,
        },
      },
    });
    this.eliminéWorld.eliminéFixtures.set(nomProjet, {
      dateDésignation: dateNotification,
      identifiantProjet,
      nom: nomProjet,
    });
  },
);
