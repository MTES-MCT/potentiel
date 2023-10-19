import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { AbandonAggregate } from '../abandon.aggregate';
import * as StatutAbandon from '../statutAbandon.valueType';
import { RéponseSignéeValueType } from '../réponseSignée.valueType';

export type AbandonRejetéEvent = DomainEvent<
  'AbandonRejeté-V1',
  {
    rejetéLe: DateTime.RawType;
    rejetéPar: IdentifiantUtilisateur.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;

export type RejeterOptions = {
  rejetéPar: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  réponseSignée: RéponseSignéeValueType;
};

export async function rejeter(
  this: AbandonAggregate,
  { rejetéPar, identifiantProjet, réponseSignée }: RejeterOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.rejeté);

  const dateRejet = DateTime.now();

  const event: AbandonRejetéEvent = {
    type: 'AbandonRejeté-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
      rejetéLe: dateRejet.formatter(),
      rejetéPar: rejetéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyAbandonRejeté(
  this: AbandonAggregate,
  { payload: { rejetéLe, réponseSignée } }: AbandonRejetéEvent,
) {
  this.statut = StatutAbandon.rejeté;

  this.rejet = {
    rejetéLe: DateTime.convertirEnValueType(rejetéLe),
    réponseSignée,
  };
  this.accord = undefined;
}
