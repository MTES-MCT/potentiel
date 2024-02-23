// Third party

// Workspaces
import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';

// Package
import { RecoursAggregate } from '../recours.aggregate';
import * as StatutRecours from '../statutRecours.valueType';

export type RecoursAccordéEvent = DomainEvent<
  'RecoursAccordé-V1',
  {
    accordéLe: DateTime.RawType;
    accordéPar: IdentifiantUtilisateur.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;

export type AccorderOptions = {
  dateAccord: DateTime.ValueType;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};

export async function accorder(
  this: RecoursAggregate,
  { dateAccord, identifiantUtilisateur, identifiantProjet, réponseSignée }: AccorderOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.accordé);

  const event: RecoursAccordéEvent = {
    type: 'RecoursAccordé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
      accordéLe: dateAccord.formatter(),
      accordéPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyRecoursAccordé(
  this: RecoursAggregate,
  { payload: { accordéLe, réponseSignée } }: RecoursAccordéEvent,
) {
  this.statut = StatutRecours.accordé;
  this.rejet = undefined;
  this.accord = {
    accordéLe: DateTime.convertirEnValueType(accordéLe),
    réponseSignée,
  };
}

export const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};
