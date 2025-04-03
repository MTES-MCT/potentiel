import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import {
  ProjetAbandonnéError,
  ProjetAchevéError,
  ProjetAvecDemandeAbandonEnCoursError,
  PuissanceIdentiqueError,
  PuissanceNulleOuNégativeError,
} from '../../errors';
import { RatioChangementPuissance, StatutChangementPuissance } from '../..';
import { PuissanceAggregate } from '../../puissance.aggregate';

export type ChangementPuissanceDemandéEvent = DomainEvent<
  'ChangementPuissanceDemandé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    autoritéCompétente: RatioChangementPuissance.AutoritéCompétente;
    raison: string;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type DemanderOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  puissance: number;
  raison: string;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateDemande: DateTime.ValueType;
  estAbandonné: boolean;
  demandeAbandonEnCours: boolean;
  estAchevé: boolean;
};

export async function demanderChangement(
  this: PuissanceAggregate,
  {
    identifiantUtilisateur,
    dateDemande,
    identifiantProjet,
    pièceJustificative,
    raison,
    puissance,
    estAbandonné,
    demandeAbandonEnCours,
    estAchevé,
  }: DemanderOptions,
) {
  if (this.puissance === puissance) {
    throw new PuissanceIdentiqueError();
  }

  if (puissance <= 0) {
    throw new PuissanceNulleOuNégativeError();
  }

  if (this.demande) {
    this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementPuissance.demandé,
    );
  }

  // TODO: on ajoutera des règles pour valider le ratios ici
  const ratio = puissance / this.puissance;

  if (estAbandonné) {
    throw new ProjetAbandonnéError();
  }

  if (demandeAbandonEnCours) {
    throw new ProjetAvecDemandeAbandonEnCoursError();
  }

  if (estAchevé) {
    throw new ProjetAchevéError();
  }

  const event: ChangementPuissanceDemandéEvent = {
    type: 'ChangementPuissanceDemandé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      puissance,
      autoritéCompétente: RatioChangementPuissance.bind({ ratio }).getAutoritéCompétente(),
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

export function applyChangementPuissanceDemandé(
  this: PuissanceAggregate,
  { payload: { puissance } }: ChangementPuissanceDemandéEvent,
) {
  this.demande = {
    statut: StatutChangementPuissance.demandé,
    nouvellePuissance: puissance,
  };
}
