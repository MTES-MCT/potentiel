import { match } from 'ts-pattern';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { InvalidOperationError } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { AbandonAggregate } from '../abandon.aggregate';
import * as StatutAbandon from '../statutAbandon.valueType';
import { TypeDocumentAbandon } from '..';

export type DemanderOptions = {
  dateDemande: DateTime.ValueType;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
  estAchevé: boolean;
};

export async function demander(
  this: AbandonAggregate,
  {
    identifiantUtilisateur,
    dateDemande,
    identifiantProjet,
    pièceJustificative,
    raison,
    estAchevé,
  }: DemanderOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.demandé);
  if (estAchevé) {
    throw new ProjetAchevéError(identifiantProjet);
  }

  if (!pièceJustificative) {
    throw new PièceJustificativeObligatoireError();
  }

  const event: Lauréat.Abandon.AbandonDemandéEvent = {
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
  event: Lauréat.Abandon.AbandonDemandéEventV1 | Lauréat.Abandon.AbandonDemandéEvent,
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

class ProjetAchevéError extends InvalidOperationError {
  constructor(public identifiantProjet: IdentifiantProjet.ValueType) {
    super("Impossible de demander l'abandon d'un projet achevé");
  }
}
