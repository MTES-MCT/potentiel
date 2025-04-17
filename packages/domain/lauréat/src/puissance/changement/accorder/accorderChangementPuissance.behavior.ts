import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

import { StatutChangementPuissance } from '../..';
import { PuissanceAggregate } from '../../puissance.aggregate';
import {
  DemandeDeChangementInexistanteError,
  DemandeDoitÊtreInstruiteParDGECError,
  RéponseSignéeObligatoireSiAccordSansDécisionDeLEtatError,
} from '../errors';

export type ChangementPuissanceAccordéEvent = DomainEvent<
  'ChangementPuissanceAccordé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nouvellePuissance: number;
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    réponseSignée?: {
      format: string;
    };
    estUneDécisionDEtat?: true;
  }
>;

type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  accordéLe: DateTime.ValueType;
  accordéPar: Email.ValueType;
  rôleUtilisateur: Role.ValueType;
  réponseSignée?: DocumentProjet.ValueType;
  estUneDécisionDEtat: boolean;
};

export async function accorderDemandeChangement(
  this: PuissanceAggregate,
  {
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée,
    rôleUtilisateur,
    estUneDécisionDEtat,
  }: Options,
) {
  if (!this.demande) {
    throw new DemandeDeChangementInexistanteError();
  }

  this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementPuissance.accordé,
  );

  if (this.demande.autoritéCompétente === 'dgec-admin' && rôleUtilisateur.nom === 'dreal') {
    throw new DemandeDoitÊtreInstruiteParDGECError();
  }

  if (!estUneDécisionDEtat && !réponseSignée) {
    throw new RéponseSignéeObligatoireSiAccordSansDécisionDeLEtatError();
  }

  const event: ChangementPuissanceAccordéEvent = {
    type: 'ChangementPuissanceAccordé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      accordéLe: accordéLe.formatter(),
      accordéPar: accordéPar.formatter(),
      réponseSignée: réponseSignée && {
        format: réponseSignée.format,
      },
      nouvellePuissance: this.demande.nouvellePuissance,
      estUneDécisionDEtat: estUneDécisionDEtat ? true : undefined,
    },
  };

  await this.publish(event);
}

export function applyChangementPuissanceAccordé(
  this: PuissanceAggregate,
  { payload: { nouvellePuissance } }: ChangementPuissanceAccordéEvent,
) {
  this.puissance = nouvellePuissance;
  this.demande = undefined;
}
