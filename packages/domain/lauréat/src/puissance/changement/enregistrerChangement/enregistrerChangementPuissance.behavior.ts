import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { PuissanceAggregate } from '../../puissance.aggregate';
import { StatutChangementPuissance } from '../..';
import {
  ProjetAbandonnéError,
  ProjetAvecDemandeAbandonEnCoursError,
  ProjetAchevéError,
} from '../errors';
import { PuissanceIdentiqueError } from '../../errors';

export type ChangementPuissanceEnregistréEvent = DomainEvent<
  'ChangementPuissanceEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;

export type EnregistrerChangementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  puissance: number;
  dateChangement: DateTime.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
  raison?: string;
  estAbandonné: boolean;
  estAchevé: boolean;
  demandeAbandonEnCours: boolean;
};

export async function enregistrerChangement(
  this: PuissanceAggregate,
  {
    identifiantProjet,
    puissance,
    dateChangement,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
    estAbandonné,
    estAchevé,
    demandeAbandonEnCours,
  }: EnregistrerChangementOptions,
) {
  if (this.puissance === puissance) {
    throw new PuissanceIdentiqueError();
  }

  // TODO: on ajoutera des vraies règles pour valider le ratios ici à l'aide du value type
  // const ratio = puissance / this.puissance;
  // vérifierQueLeChangementDePuissanceEstPossibleAvecEn(this.puissance)

  if (this.demande) {
    this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementPuissance.informationEnregistrée,
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

  const event: ChangementPuissanceEnregistréEvent = {
    type: 'ChangementPuissanceEnregistré-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      puissance,
      enregistréLe: dateChangement.formatter(),
      enregistréPar: identifiantUtilisateur.formatter(),
      raison,
      pièceJustificative: pièceJustificative ?? undefined,
    },
  };

  await this.publish(event);
}

export function applyChangementPuissanceEnregistré(
  this: PuissanceAggregate,
  { payload: { puissance } }: ChangementPuissanceEnregistréEvent,
) {
  this.puissance = puissance;
}
