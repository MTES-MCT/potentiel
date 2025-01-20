import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import { TypeReprésentantLégal } from '../..';

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
  // if (
  //   this.représentantLégal?.nom === nomReprésentantLégal &&
  //   this.représentantLégal.type.estÉgaleÀ(typeReprésentantLégal)
  // ) {
  //   throw new ReprésentantLégalIdentifiqueError();
  // }

  // if (typeReprésentantLégal.estInconnu()) {
  //   throw new ReprésentantLégalTypeInconnuError();
  // }

  // if (this.demande) {
  //   this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
  //     StatutChangementReprésentantLégal.demandé,
  //   );
  // }

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
    payload: { nomReprésentantLégal, typeReprésentantLégal },
  }: ChangementReprésentantLégalCorrigéEvent,
) {
  if (this.demande) {
    this.demande.nom = nomReprésentantLégal;
    this.demande.type = TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal);
  }
}
