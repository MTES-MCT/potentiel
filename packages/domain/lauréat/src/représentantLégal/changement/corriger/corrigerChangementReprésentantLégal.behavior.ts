import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import { TypeDocumentChangementReprésentantLégal, TypeReprésentantLégal } from '../..';
import { DemandeChangementInexistanteError } from '../changementReprésentantLégal.error';

export type ChangementReprésentantLégalCorrigéEvent = DomainEvent<
  'ChangementReprésentantLégalCorrigé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.RawType;
    corrigéLe: DateTime.RawType;
    corrigéPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type CorrigerChangementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateCorrection: DateTime.ValueType;
};

export async function corriger(
  this: ReprésentantLégalAggregate,
  {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    identifiantUtilisateur,
    dateCorrection,
  }: CorrigerChangementOptions,
) {
  if (!this.demande) {
    throw new DemandeChangementInexistanteError();
  }

  if (this.demande.statut.estAccordé()) {
    throw new ChangementDéjàAccordéError();
  }

  if (this.demande.statut.estRejeté()) {
    throw new ChangementDéjàRejetéError();
  }

  const event: ChangementReprésentantLégalCorrigéEvent = {
    type: 'ChangementReprésentantLégalCorrigé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      nomReprésentantLégal,
      typeReprésentantLégal: typeReprésentantLégal.formatter(),
      corrigéLe: dateCorrection.formatter(),
      corrigéPar: identifiantUtilisateur.formatter(),
      pièceJustificative: { format: pièceJustificative.format },
    },
  };

  await this.publish(event);
}

export function applyChangementReprésentantLégalCorrigé(
  this: ReprésentantLégalAggregate,
  {
    payload: { nomReprésentantLégal, typeReprésentantLégal, identifiantProjet, pièceJustificative },
  }: ChangementReprésentantLégalCorrigéEvent,
) {
  if (this.demande) {
    this.demande.nom = nomReprésentantLégal;
    this.demande.type = TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal);
    this.demande.pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjet,
      TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
      this.demande.demandéLe.formatter(),
      pièceJustificative.format,
    );
  }
}

class ChangementDéjàAccordéError extends InvalidOperationError {
  constructor() {
    super(`Le changement de représentant légal a déjà été accordé`);
  }
}
class ChangementDéjàRejetéError extends InvalidOperationError {
  constructor() {
    super(`Le changement de représentant légal a déjà été rejeté`);
  }
}
