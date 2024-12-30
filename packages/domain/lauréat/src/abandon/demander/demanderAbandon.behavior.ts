import { match } from 'ts-pattern';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';

import { AbandonAggregate } from '../abandon.aggregate';
import * as StatutAbandon from '../statutAbandon.valueType';
import { TypeDocumentAbandon } from '..';

/**
 * @deprecated use AbandonDemandéEvent instead
 */
export type AbandonDemandéEventV1 = DomainEvent<
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

export type AbandonDemandéEvent = DomainEvent<
  'AbandonDemandé-V2',
  {
    demandéLe: DateTime.RawType;
    demandéPar: IdentifiantUtilisateur.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    raison: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;

export type DemanderOptions = {
  dateDemande: DateTime.ValueType;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
  raison: string;
};

export async function demander(
  this: AbandonAggregate,
  {
    identifiantUtilisateur,
    dateDemande,
    identifiantProjet,
    pièceJustificative,
    raison,
  }: DemanderOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.demandé);

  if (!pièceJustificative) {
    throw new PièceJustificativeObligatoireError();
  }

  const event: AbandonDemandéEvent = {
    type: 'AbandonDemandé-V2',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      pièceJustificative: pièceJustificative && {
        format: pièceJustificative.format,
      },
      raison,
      demandéLe: dateDemande.formatter(),
      demandéPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyAbandonDemandé(
  this: AbandonAggregate,
  event: AbandonDemandéEventV1 | AbandonDemandéEvent,
) {
  const { identifiantProjet, demandéLe, demandéPar, raison, pièceJustificative } = event.payload;

  this.statut = StatutAbandon.demandé;

  this.demande = {
    recandidature: match(event)
      .with({ type: 'AbandonDemandé-V1' }, (event) => event.payload.recandidature)
      .otherwise(() => false),
    pièceJustificative:
      pièceJustificative &&
      DocumentProjet.convertirEnValueType(
        identifiantProjet,
        TypeDocumentAbandon.pièceJustificative.formatter(),
        demandéLe,
        pièceJustificative?.format,
      ),
    raison,
    demandéLe: DateTime.convertirEnValueType(demandéLe),
    demandéPar: IdentifiantUtilisateur.convertirEnValueType(demandéPar),
  };
  this.rejet = undefined;
  this.accord = undefined;
  this.annuléLe = undefined;
}

class PièceJustificativeObligatoireError extends InvalidOperationError {
  constructor() {
    super('La pièce justificative est obligatoire');
  }
}
