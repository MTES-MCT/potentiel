import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { ActionnaireAggregate } from '../actionnaire.aggregate';
import {
  ActionnaireIdentifiqueError,
  DemandeDeChangementEnCoursError,
  ProjetAbandonnéError,
  ProjetAchevéError,
  ProjetAvecDemandeAbandonEnCoursError,
} from '../errors';

export type ActionnaireModifiéEvent = DomainEvent<
  'ActionnaireModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    raison: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;

export type ModifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  actionnaire: string;
  dateModification: DateTime.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
  raison: string;
  estAbandonnéEtUtilisateurEstPorteur: boolean;
  estAchevéEtUtilisateurEstPorteur: boolean;
  demandeAbandonEnCoursEtUtilisateurEstPorteur: boolean;
};

export async function modifier(
  this: ActionnaireAggregate,
  {
    identifiantProjet,
    actionnaire,
    dateModification,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
    estAbandonnéEtUtilisateurEstPorteur,
    estAchevéEtUtilisateurEstPorteur,
    demandeAbandonEnCoursEtUtilisateurEstPorteur,
  }: ModifierOptions,
) {
  if (this.actionnaire === actionnaire) {
    throw new ActionnaireIdentifiqueError();
  }

  if (this.demande?.statut.estDemandé()) {
    throw new DemandeDeChangementEnCoursError();
  }

  if (estAbandonnéEtUtilisateurEstPorteur) {
    throw new ProjetAbandonnéError();
  }

  if (demandeAbandonEnCoursEtUtilisateurEstPorteur) {
    throw new ProjetAvecDemandeAbandonEnCoursError();
  }

  if (estAchevéEtUtilisateurEstPorteur) {
    throw new ProjetAchevéError();
  }

  const event: ActionnaireModifiéEvent = {
    type: 'ActionnaireModifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      actionnaire,
      modifiéLe: dateModification.formatter(),
      modifiéPar: identifiantUtilisateur.formatter(),
      raison,
      pièceJustificative: pièceJustificative && {
        format: pièceJustificative.format,
      },
    },
  };

  await this.publish(event);
}

export function applyActionnaireModifié(
  this: ActionnaireAggregate,
  { payload: { actionnaire } }: ActionnaireModifiéEvent,
) {
  this.actionnaire = actionnaire;
}
