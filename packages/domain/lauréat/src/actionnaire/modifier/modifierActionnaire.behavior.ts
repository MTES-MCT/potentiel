import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { ActionnaireAggregate } from '../actionnaire.aggregate';
import {
  ActionnaireNePeutPasÊtreModifiéDirectement,
  ActionnaireIdentiqueError,
  DemandeDeChangementEnCoursError,
  ProjetAbandonnéError,
  ProjetAvecDemandeAbandonEnCoursError,
  ProjetAchevéError,
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
  estAbandonné: boolean;
  estAchevé: boolean;
  demandeAbandonEnCours: boolean;
  utilisateurEstPorteur: boolean;
  estParticipatif: boolean;
  aDesGarantiesFinancièresConstituées: boolean;
  aUnDépotEnCours: boolean;
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
    estAbandonné,
    estAchevé,
    demandeAbandonEnCours,
    utilisateurEstPorteur,
    estParticipatif,
    aUnDépotEnCours,
    aDesGarantiesFinancièresConstituées,
  }: ModifierOptions,
) {
  // Règle métier, spécifique à l'AO Eolien (pour lequel le type de GF est `après candidature`)
  // La demande doit être en "instruction" si il n'y a pas de GF validées sur le projet ou si il y a une demande de renouvellement ou de modifications des garanties financières en cours
  // La demande doit être en "instruction" si le candidat a joint à son offre la lettre d’engagement (l'investissement participatif ou financement participatif)
  const devraitPasserParUneDemande =
    identifiantProjet.appelOffre === 'Eolien' &&
    (!aDesGarantiesFinancièresConstituées || aUnDépotEnCours || estParticipatif);

  if (utilisateurEstPorteur && devraitPasserParUneDemande) {
    throw new ActionnaireNePeutPasÊtreModifiéDirectement();
  }

  if (this.actionnaire === actionnaire) {
    throw new ActionnaireIdentiqueError();
  }

  if (this.demande?.statut.estDemandé()) {
    throw new DemandeDeChangementEnCoursError();
  }

  if (utilisateurEstPorteur && estAbandonné) {
    throw new ProjetAbandonnéError();
  }

  if (utilisateurEstPorteur && demandeAbandonEnCours) {
    throw new ProjetAvecDemandeAbandonEnCoursError();
  }

  if (utilisateurEstPorteur && estAchevé) {
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
