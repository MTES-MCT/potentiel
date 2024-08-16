import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';

import { mapExampleToUseCaseDefaultValues } from './helper';

Quand(
  `un administrateur importe la candidature {string} avec:`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    const { identifiantProjet, values } = mapExampleToUseCaseDefaultValues(nomProjet, exemple);

    try {
      await mediator.send<Candidature.ImporterCandidatureUseCase>({
        type: 'Candidature.UseCase.ImporterCandidature',
        data: values,
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
        data,
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
