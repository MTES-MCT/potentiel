import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { AbandonAggregate } from '../abandon.aggregate';
import * as StatutAbandon from '../statutAbandon.valueType';
import { DocumentProjet } from '@potentiel-domain/document';

export type AbandonDemandéEvent = DomainEvent<
  'AbandonDemandé-V1',
  {
    demandéLe: DateTime.RawType;
    demandéPar: IdentifiantUtilisateur.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    raison: string;
    recandidature: boolean;
    pièceJustificative?: {
      format: string;
    };
  }
>;

export type DemanderOptions = {
  dateDemande: DateTime.ValueType;
  utilisateur: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
  recandidature: boolean;
  raison: string;
};

export async function demander(
  this: AbandonAggregate,
  {
    utilisateur,
    dateDemande,
    identifiantProjet,
    pièceJustificative,
    raison,
    recandidature,
  }: DemanderOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.demandé);

  const event: AbandonDemandéEvent = {
    type: 'AbandonDemandé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      recandidature,
      pièceJustificative: pièceJustificative && {
        format: pièceJustificative.format,
      },
      raison,
      demandéLe: dateDemande.formatter(),
      demandéPar: utilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyAbandonDemandé(
  this: AbandonAggregate,
  { payload: { demandéLe, raison, recandidature, pièceJustificative } }: AbandonDemandéEvent,
) {
  this.statut = StatutAbandon.demandé;

  this.demande = {
    recandidature,
    pièceJustificative,
    raison,
    demandéLe: DateTime.convertirEnValueType(demandéLe),
  };
  this.rejet = undefined;
  this.accord = undefined;
  this.annuléLe = undefined;
}
