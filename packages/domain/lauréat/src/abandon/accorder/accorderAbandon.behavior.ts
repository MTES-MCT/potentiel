// Third party

// Workspaces
import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';

// Package
import { AbandonAggregate } from '../abandon.aggregate';
import * as StatutAbandon from '../statutAbandon.valueType';

export type AbandonAccordéEvent = DomainEvent<
  'AbandonAccordé-V1',
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
  this: AbandonAggregate,
  { dateAccord, identifiantUtilisateur, identifiantProjet, réponseSignée }: AccorderOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.accordé);

  const event: AbandonAccordéEvent = {
    type: 'AbandonAccordé-V1',
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

  // TODO: Il faut attendre un peu ici car sinon l'exécution des projecteurs risque se faire en même temps
  // et générer des projections avec des données erronées
  // Idéalement il ne faudrait pas avoir des projecteur qui s'exécute en parallèle

  if (this.demande.recandidature) {
    await this.demanderPreuveRecandidature({
      identifiantProjet,
      dateDemande: dateAccord,
    });
  }
}

export function applyAbandonAccordé(
  this: AbandonAggregate,
  { payload: { accordéLe, réponseSignée } }: AbandonAccordéEvent,
) {
  this.statut = StatutAbandon.accordé;
  this.rejet = undefined;
  this.accord = {
    accordéLe: DateTime.convertirEnValueType(accordéLe),
    réponseSignée,
  };
}
