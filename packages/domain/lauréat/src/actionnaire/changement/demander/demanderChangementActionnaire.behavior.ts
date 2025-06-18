import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { StatutChangementActionnaire } from '../..';
import { ActionnaireAggregate } from '../../actionnaire.aggregate';
import {
  ProjetAbandonnéError,
  ProjetAvecDemandeAbandonEnCoursError,
  ProjetAchevéError,
} from '../../errors';

export type DemanderOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: string;
  raison: string;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateDemande: DateTime.ValueType;
  estAbandonné: boolean;
  demandeAbandonEnCours: boolean;
  estAchevé: boolean;
};

// l'actionnaire peut être le même
// car une demande peut être une simple transmission de documents
export async function demanderChangement(
  this: ActionnaireAggregate,
  {
    identifiantUtilisateur,
    dateDemande,
    identifiantProjet,
    pièceJustificative,
    raison,
    actionnaire,
    estAbandonné,
    demandeAbandonEnCours,
    estAchevé,
  }: DemanderOptions,
) {
  if (this.demande) {
    this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementActionnaire.demandé,
    );
  }

  if (estAbandonné) {
    throw new ProjetAbandonnéError();
  }

  if (demandeAbandonEnCours) {
    throw new ProjetAvecDemandeAbandonEnCoursError();
  }

  if (estAchevé) {
    throw new ProjetAchevéError();
  }

  const event: Lauréat.Actionnaire.ChangementActionnaireDemandéEvent = {
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
  { payload: { actionnaire } }: Lauréat.Actionnaire.ChangementActionnaireDemandéEvent,
) {
  this.demande = {
    statut: StatutChangementActionnaire.demandé,
    nouvelActionnaire: actionnaire,
  };
}
