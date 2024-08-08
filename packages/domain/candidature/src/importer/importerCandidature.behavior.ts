import { DomainEvent } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { CandidatureAggregate } from '../candidature.aggregate';
import * as StatutCandidature from '../statutCandidature.valueType';

export type CandidatureImportéeEvent = DomainEvent<
  'CandidatureImportée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    statut: StatutCandidature.RawType;
    nomProjet: string;
  }
>;

type ImporterCandidatureOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutCandidature.ValueType;
  nomProjet: string;
};

export async function importer(
  this: CandidatureAggregate,
  { identifiantProjet, statut, nomProjet }: ImporterCandidatureOptions,
) {
  const event: CandidatureImportéeEvent = {
    type: 'CandidatureImportée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      statut: statut.statut,
      nomProjet,
    },
  };
  await this.publish(event);
}

export function applyCandidatureImportée(
  this: CandidatureAggregate,
  { payload: { statut } }: CandidatureImportéeEvent,
) {
  this.statut = StatutCandidature.convertirEnValueType(statut);
}
