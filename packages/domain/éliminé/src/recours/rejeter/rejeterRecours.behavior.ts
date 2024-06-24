import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { RecoursAggregate } from '../recours.aggregate';
import * as StatutRecours from '../statutRecours.valueType';

export type RecoursRejetéEvent = DomainEvent<
  'RecoursRejeté-V1',
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
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};

export async function rejeter(
  this: RecoursAggregate,
  { identifiantUtilisateur, dateRejet, identifiantProjet, réponseSignée }: RejeterOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.rejeté);

  const event: RecoursRejetéEvent = {
    type: 'RecoursRejeté-V1',
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

export function applyRecoursRejeté(
  this: RecoursAggregate,
  { payload: { rejetéLe, réponseSignée } }: RecoursRejetéEvent,
) {
  this.statut = StatutRecours.rejeté;

  this.rejet = {
    rejetéLe: DateTime.convertirEnValueType(rejetéLe),
    réponseSignée,
  };
  this.accord = undefined;
}
