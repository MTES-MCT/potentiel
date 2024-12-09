import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { StatutModificationActionnaire } from '..';
import { ActionnaireAggregate } from '../actionnaire.aggregate';

export type ModificationActionnaireDemandéeEvent = DomainEvent<
  'ModificationActionnaireDemandée-V1',
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

export async function demanderModification(
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
  if (this.statutDemande) {
    this.statutDemande.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutModificationActionnaire.demandé,
    );
  }

  const event: ModificationActionnaireDemandéeEvent = {
    type: 'ModificationActionnaireDemandée-V1',
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

export function applyModificationActionnaireDemandée(this: ActionnaireAggregate) {
  this.statutDemande = StatutModificationActionnaire.demandé;
}
