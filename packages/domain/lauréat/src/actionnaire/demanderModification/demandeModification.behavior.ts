import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';

import { StatutModificationActionnaire } from '..';
import { ActionnaireAggregate } from '../actionnaire.aggregate';

export type ModificationActionnaireDemandéeEvent = DomainEvent<
  'ModificationActionnaireDemandée-V1',
  {
    demandéLe: DateTime.RawType;
    demandéPar: IdentifiantUtilisateur.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    raison?: string;
    actionnaire: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type DemanderOptions = {
  dateDemande: DateTime.ValueType;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  actionnaire: string;
  raison?: string;
};

export async function demander(
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

export function applyModificationActionnaireDemandée(this: ActionnaireAggregate) {
  this.statutDemande = StatutModificationActionnaire.demandé;
}
