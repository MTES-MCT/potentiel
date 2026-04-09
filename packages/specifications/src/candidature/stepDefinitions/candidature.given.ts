import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { mapDateTime } from '#helpers';

import { PotentielWorld } from '../../potentiel.world.js';
import { DeepPartial } from '../../fixture.js';

EtantDonné(
  `la candidature lauréate {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();

    await importerCandidature.call(this, {
      nomProjet,
      statut: 'classé',
      ...this.candidatureWorld.mapExempleToFixtureValues(exemple),
    });
  },
);

EtantDonné(
  `la candidature éliminée {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, { nomProjet, statut: 'éliminé' });
  },
);

EtantDonné(
  `la candidature lauréate {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, { nomProjet, statut: 'classé' });
  },
);

EtantDonné(
  `la candidature lauréate {string} importée avec ses données de raccordement avec :`,
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();

    await importerCandidature.call(this, {
      nomProjet,
      statut: 'classé',
      dépôt: {
        raccordements: [
          {
            référence: exemple['réference raccordement'],
            dateQualification: mapDateTime(exemple['date qualification raccordement']),
          },
        ],
      },
    });
  },
);

type ImporterCandidatureProps = {
  nomProjet?: string;
  statut: Candidature.StatutCandidature.RawType;
  dépôt?: Omit<DeepPartial<Candidature.Dépôt.RawType>, 'fournisseurs'>;
  instruction?: DeepPartial<Candidature.Instruction.RawType>;
  identifiantProjet?: Partial<PlainType<IdentifiantProjet.ValueType>>;
};
export async function importerCandidature(
  this: PotentielWorld,
  {
    nomProjet,
    statut,
    dépôt,
    identifiantProjet: identifiantProjetValue,
    instruction,
  }: ImporterCandidatureProps,
) {
  const { dépôtValue, détailsValue, identifiantProjet, importéLe, importéPar, instructionValue } =
    this.candidatureWorld.importerCandidature.créer({
      identifiantProjet: identifiantProjetValue,
      dépôt: {
        ...(nomProjet ? { nomProjet } : {}),
        ...dépôt,
      },
      instruction: {
        ...instruction,
        statut,
      },
      importéPar: this.utilisateurWorld.validateurFixture.email,
    });

  await mediator.send<Candidature.ImporterCandidatureUseCase>({
    type: 'Candidature.UseCase.ImporterCandidature',
    data: {
      identifiantProjetValue: identifiantProjet,
      dépôtValue,
      détailsValue,
      importéLe,
      importéPar,
      instructionValue,
    },
  });
}
