import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { ActionnaireAggregate } from '../../actionnaire.aggregate';
import {
  ActionnaireNePeutPasÊtreModifiéDirectement,
  ProjetAbandonnéError,
  ProjetAvecDemandeAbandonEnCoursError,
  ProjetAchevéError,
} from '../../errors';
import { StatutChangementActionnaire } from '../..';

export type ChangementActionnaireEnregistréEvent = DomainEvent<
  'ChangementActionnaireEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type EnregistrerChangementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  actionnaire: string;
  dateChangement: DateTime.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
  estAbandonné: boolean;
  estAchevé: boolean;
  demandeAbandonEnCours: boolean;
  estParticipatif: boolean;
  aDesGarantiesFinancièresConstituées: boolean;
  aUnDépotEnCours: boolean;
};

export async function enregistrerChangement(
  this: ActionnaireAggregate,
  {
    identifiantProjet,
    actionnaire,
    dateChangement,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
    estAbandonné,
    estAchevé,
    demandeAbandonEnCours,
    estParticipatif,
    aUnDépotEnCours,
    aDesGarantiesFinancièresConstituées,
  }: EnregistrerChangementOptions,
) {
  // Règle métier, spécifique à l'AO Eolien (pour lequel le type de GF est `après candidature`) pour les porteurs
  // La demande doit être en "instruction" si il n'y a pas de GF validées sur le projet ou si il y a une demande de renouvellement ou de modifications des garanties financières en cours
  // La demande doit être en "instruction" si le candidat a joint à son offre la lettre d’engagement (l'investissement participatif ou financement participatif)
  const devraitPasserParUneDemande =
    identifiantProjet.appelOffre === 'Eolien' &&
    (!aDesGarantiesFinancièresConstituées || aUnDépotEnCours || estParticipatif);

  if (devraitPasserParUneDemande) {
    throw new ActionnaireNePeutPasÊtreModifiéDirectement();
  }

  if (this.demande) {
    this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementActionnaire.informationEnregistrée,
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

  const event: ChangementActionnaireEnregistréEvent = {
    type: 'ChangementActionnaireEnregistré-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      actionnaire,
      enregistréLe: dateChangement.formatter(),
      enregistréPar: identifiantUtilisateur.formatter(),
      raison,
      pièceJustificative: {
        format: pièceJustificative.format,
      },
    },
  };

  await this.publish(event);
}

export function applyChangementActionnaireEnregistré(
  this: ActionnaireAggregate,
  { payload: { actionnaire } }: ChangementActionnaireEnregistréEvent,
) {
  this.actionnaire = actionnaire;
}
