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
} from '../errors';

export type ChangementPuissanceRejetéEvent = DomainEvent<
  'ChangementPuissanceRejeté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    rejetéLe: DateTime.RawType;
    rejetéPar: Email.RawType;
    réponseSignée: {
      format: string;
    };
    estUneDécisionDEtat?: true;
  }
>;

type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rejetéLe: DateTime.ValueType;
  rejetéPar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
  rôleUtilisateur: Role.ValueType;
  estUneDécisionDEtat: boolean;
};

export async function rejeterDemandeChangement(
  this: PuissanceAggregate,
  {
    identifiantProjet,
    rejetéLe,
    rejetéPar,
    réponseSignée,
    rôleUtilisateur,
    estUneDécisionDEtat,
  }: Options,
) {
  if (!this.demande) {
    throw new DemandeDeChangementInexistanteError();
  }

  this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementPuissance.rejeté,
  );

  const rôlesAutorisésPourDGEC: Array<Role.RawType> = ['admin', 'dgec-validateur'];

  if (
    this.demande.autoritéCompétente === 'dgec-admin' &&
    !rôlesAutorisésPourDGEC.includes(rôleUtilisateur.nom)
  ) {
    throw new DemandeDoitÊtreInstruiteParDGECError();
  }

  const event: ChangementPuissanceRejetéEvent = {
    type: 'ChangementPuissanceRejeté-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      rejetéLe: rejetéLe.formatter(),
      rejetéPar: rejetéPar.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
      estUneDécisionDEtat: estUneDécisionDEtat ? true : undefined,
    },
  };

  await this.publish(event);
}

export function applyChangementPuissanceRejeté(
  this: PuissanceAggregate,
  _: ChangementPuissanceRejetéEvent,
) {
  this.demande = undefined;
}
