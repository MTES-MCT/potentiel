import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';

import { RecoursAggregate } from '../recours.aggregate';
import * as StatutRecours from '../statutRecours.valueType';
import { TypeDocumentRecours } from '..';

export type RecoursDemandéEvent = DomainEvent<
  'RecoursDemandé-V1',
  {
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    raison: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type DemanderOptions = {
  dateDemande: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
  estUnProjetLauréat: boolean;
};

export async function demander(
  this: RecoursAggregate,
  {
    identifiantUtilisateur,
    dateDemande,
    identifiantProjet,
    pièceJustificative,
    raison,
    estUnProjetLauréat,
  }: DemanderOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.demandé);

  if (estUnProjetLauréat) {
    throw new RecoursPourProjetLauréatError();
  }

  const event: RecoursDemandéEvent = {
    type: 'RecoursDemandé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      pièceJustificative: {
        format: pièceJustificative.format,
      },
      raison,
      demandéLe: dateDemande.formatter(),
      demandéPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyRecoursDemandé(
  this: RecoursAggregate,
  {
    payload: { identifiantProjet, demandéLe, demandéPar, raison, pièceJustificative },
  }: RecoursDemandéEvent,
) {
  this.statut = StatutRecours.demandé;

  this.demande = {
    pièceJustificative:
      pièceJustificative &&
      DocumentProjet.convertirEnValueType(
        identifiantProjet,
        TypeDocumentRecours.pièceJustificative.formatter(),
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

class RecoursPourProjetLauréatError extends InvalidOperationError {
  constructor() {
    super('Il est impossible de demander un recours pour un projet lauréat');
  }
}
