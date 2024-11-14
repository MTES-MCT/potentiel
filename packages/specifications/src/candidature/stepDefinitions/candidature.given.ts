import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { Lauréat } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';
import { Éliminé } from '@potentiel-domain/elimine';

import { PotentielWorld } from '../../potentiel.world';
import { DeepPartial } from '../../fixture';

import { vérifierAttestationDeDésignation } from './candidature.then';

EtantDonné(
  `la candidature lauréate {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    await importerCandidature.call(
      this,
      nomProjet,
      'classé',
      this.candidatureWorld.mapExempleToFixtureValues(exemple),
    );
  },
);

EtantDonné(
  `la candidature éliminée {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'éliminé');
  },
);

EtantDonné(
  `la candidature lauréate {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'classé');
  },
);

EtantDonné(
  'la candidature lauréate notifiée {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'classé');

    await notifierCandidature.call(this);
  },
);

EtantDonné(
  'la candidature éliminée notifiée {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'éliminé');

    await notifierCandidature.call(this);
  },
);

export async function importerCandidature(
  this: PotentielWorld,
  nomProjet: string,
  statut: Candidature.StatutCandidature.RawType,
  partialValues?: DeepPartial<Candidature.ImporterCandidatureUseCase['data']>,
  identifiantProjet?: string,
) {
  if (!this.utilisateurWorld.validateurFixture.aÉtéCréé) {
    this.utilisateurWorld.validateurFixture.créer();
  }

  const { values } = this.candidatureWorld.importerCandidature.créer({
    identifiantProjet,
    values: {
      ...partialValues,
      statutValue: statut,
      nomProjetValue: nomProjet,
      importéPar: this.utilisateurWorld.validateurFixture.email,
    },
  });

  await mediator.send<Candidature.ImporterCandidatureUseCase>({
    type: 'Candidature.UseCase.ImporterCandidature',
    data: values,
  });
}

async function notifierCandidature(this: PotentielWorld) {
  const {
    identifiantProjet,
    values: { statutValue },
  } = this.candidatureWorld.importerCandidature;
  this.utilisateurWorld.porteurFixture.créer({
    email: this.candidatureWorld.importerCandidature.values.emailContactValue,
  });

  const data = {
    identifiantProjetValue: identifiantProjet,
    notifiéLeValue: DateTime.now().formatter(),
    notifiéParValue: this.utilisateurWorld.validateurFixture.email,
    attestationValue: {
      format: `application/pdf`,
    },
    validateurValue: {
      fonction: this.utilisateurWorld.validateurFixture.fonction,
      nomComplet: this.utilisateurWorld.validateurFixture.nom,
    },
  };
  if (statutValue === 'classé') {
    await mediator.send<Lauréat.NotifierLauréatUseCase>({
      type: 'Lauréat.UseCase.NotifierLauréat',
      data,
    });
    this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture.créer({
      nomReprésentantLégal:
        this.candidatureWorld.importerCandidature.values.nomReprésentantLégalValue,
      importéLe: data.notifiéLeValue,
    });
  } else {
    await mediator.send<Éliminé.NotifierÉliminéUseCase>({
      type: 'Éliminé.UseCase.NotifierÉliminé',
      data,
    });
  }
  // on vérifie l'attestation de désignation dès le "given"
  // afin de s'assurer que la saga est bien exécutée
  await vérifierAttestationDeDésignation(identifiantProjet);
}
