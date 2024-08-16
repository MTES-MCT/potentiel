import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';

import { mapExampleToUseCaseDefaultValues } from './helper';

EtantDonné(`la candidature {string}`, async function (this: PotentielWorld, nomProjet: string) {
  const { values, identifiantProjet } = mapExampleToUseCaseDefaultValues(nomProjet, {});
  await mediator.send<Candidature.ImporterCandidatureUseCase>({
    type: 'Candidature.UseCase.ImporterCandidature',
    data: values,
  });

  this.candidatureWorld.candidatureFixtures.set(nomProjet, {
    nom: nomProjet,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    values,
  });
});

EtantDonné(
  `la candidature {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    const { values, identifiantProjet } = mapExampleToUseCaseDefaultValues(nomProjet, exemple);
    await mediator.send<Candidature.ImporterCandidatureUseCase>({
      type: 'Candidature.UseCase.ImporterCandidature',
      data: values,
    });

    this.candidatureWorld.candidatureFixtures.set(nomProjet, {
      nom: nomProjet,
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      values,
    });
  },
);
