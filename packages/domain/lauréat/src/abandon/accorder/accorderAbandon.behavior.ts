import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { RéponseSignéeValueType } from '../réponseSignée.valueType';
import { AbandonAggregate, createAbandonAggregateId } from '../abandon.aggregate';
import * as StatutAbandon from '../statutAbandon.valueType';

export type AbandonAccordéEvent = DomainEvent<
  'AbandonAccordé-V1',
  {
    acceptéLe: DateTime.RawType;
    acceptéPar: IdentifiantUtilisateur.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;

export type AccorderOptions = {
  accordéPar: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  réponseSignée: RéponseSignéeValueType;
};

export async function accorder(
  this: AbandonAggregate,
  { accordéPar, identifiantProjet, réponseSignée }: AccorderOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.accordé);

  const dateAccord = DateTime.now();

  const event: AbandonAccordéEvent = {
    type: 'AbandonAccordé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
      acceptéLe: dateAccord.formatter(),
      acceptéPar: accordéPar.formatter(),
    },
  };

  await this.publish(createAbandonAggregateId(identifiantProjet), event);
}
