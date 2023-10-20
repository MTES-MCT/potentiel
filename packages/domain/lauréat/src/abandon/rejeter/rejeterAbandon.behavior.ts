import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { AbandonAggregate } from '../abandon.aggregate';
import * as StatutAbandon from '../statutAbandon.valueType';
import { DocumentProjet } from '@potentiel-domain/document';

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
  dateRejet: DateTime.ValueType;
  utilisateur: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};

export async function rejeter(
  this: AbandonAggregate,
  { utilisateur, dateRejet, identifiantProjet, réponseSignée }: RejeterOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.rejeté);

  const event: AbandonRejetéEvent = {
    type: 'AbandonRejeté-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
      rejetéLe: dateRejet.formatter(),
      rejetéPar: utilisateur.formatter(),
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
