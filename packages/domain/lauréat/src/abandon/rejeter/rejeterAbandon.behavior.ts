import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { AbandonAggregate } from '../abandon.aggregate';

export type RejeterOptions = {
  dateRejet: DateTime.ValueType;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};

export async function rejeter(
  this: AbandonAggregate,
  { identifiantUtilisateur, dateRejet, identifiantProjet, réponseSignée }: RejeterOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(Lauréat.Abandon.StatutAbandon.rejeté);

  const event: Lauréat.Abandon.AbandonRejetéEvent = {
    type: 'AbandonRejeté-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
      rejetéLe: dateRejet.formatter(),
      rejetéPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyAbandonRejeté(
  this: AbandonAggregate,
  { payload: { rejetéLe, réponseSignée } }: Lauréat.Abandon.AbandonRejetéEvent,
) {
  this.statut = Lauréat.Abandon.StatutAbandon.rejeté;

  this.rejet = {
    rejetéLe: DateTime.convertirEnValueType(rejetéLe),
    réponseSignée,
  };
  this.accord = undefined;
}
