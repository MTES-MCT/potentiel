import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { StatutChangementActionnaire } from '..';
import { ActionnaireAggregate } from '../actionnaire.aggregate';
import { ActionnaireIdentifiqueError } from '../errors';

export type ChangementActionnaireDemandéEvent = DomainEvent<
  'ChangementActionnaireDemandé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    raison?: string;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type DemanderOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: string;
  raison?: string;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateDemande: DateTime.ValueType;
};

export async function demanderChangement(
  this: ActionnaireAggregate,
  {
    identifiantUtilisateur,
    dateDemande,
    identifiantProjet,
    pièceJustificative,
    raison,
    actionnaire,
  }: DemanderOptions,
) {
  if (this.actionnaire === actionnaire) {
    throw new ActionnaireIdentifiqueError();
  }

  if (this.demande) {
    this.demande.statutDemande.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementActionnaire.demandé,
    );
  }

  const event: ChangementActionnaireDemandéEvent = {
    type: 'ChangementActionnaireDemandé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      actionnaire,
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

export function applyChangementActionnaireDemandé(
  this: ActionnaireAggregate,
  { payload: { actionnaire } }: ChangementActionnaireDemandéEvent,
) {
  this.demande = {
    statutDemande: StatutChangementActionnaire.demandé,
    nouvelActionnaire: actionnaire,
  };
}
