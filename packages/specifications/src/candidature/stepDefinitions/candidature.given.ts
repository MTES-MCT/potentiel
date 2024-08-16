import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';

import { mapExampleToUseCaseDefaultValues } from './helper';

async function importerCandidature(
  world: PotentielWorld,
  nomProjet: string,
  data: Record<string, string>,
) {
  const { values, identifiantProjet } = mapExampleToUseCaseDefaultValues(nomProjet, data);
  await mediator.send<Candidature.ImporterCandidatureUseCase>({
    type: 'Candidature.UseCase.ImporterCandidature',
    data: values,
  });

  world.candidatureWorld.candidatureFixtures.set(nomProjet, {
    nom: nomProjet,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    values,
  });
}

EtantDonné(`la candidature {string}`, async function (this: PotentielWorld, nomProjet: string) {
  await importerCandidature(this, nomProjet, {});
});

EtantDonné(
  `la candidature {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    await importerCandidature(this, nomProjet, exemple);
  },
);
