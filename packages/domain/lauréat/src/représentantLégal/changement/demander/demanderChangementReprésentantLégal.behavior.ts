import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import { StatutChangementReprésentantLégal, TypeReprésentantLégal } from '../..';
import { ReprésentantLégalIdentifiqueError } from '../../représentantLégalIdentique.error';

import { ReprésentantLégalTypeInconnuError } from './demanderChangementReprésentantLégal.errors';

export type ChangementReprésentantLégalDemandéEvent = DomainEvent<
  'ChangementReprésentantLégalDemandé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.RawType;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type DemanderChangementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateDemande: DateTime.ValueType;
};

export async function demander(
  this: ReprésentantLégalAggregate,
  {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    identifiantUtilisateur,
    dateDemande,
  }: DemanderChangementOptions,
) {
  if (
    this.représentantLégal.nom === nomReprésentantLégal &&
    this.représentantLégal.type.estÉgaleÀ(typeReprésentantLégal)
  ) {
    throw new ReprésentantLégalIdentifiqueError();
  }

  if (typeReprésentantLégal.estInconnu()) {
    throw new ReprésentantLégalTypeInconnuError();
  }

  console.log('😍', this.demande);

  if (this.demande) {
    this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementReprésentantLégal.demandé,
    );
  }

  const event: ChangementReprésentantLégalDemandéEvent = {
    type: 'ChangementReprésentantLégalDemandé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      nomReprésentantLégal,
      typeReprésentantLégal: typeReprésentantLégal.formatter(),
      demandéLe: dateDemande.formatter(),
      demandéPar: identifiantUtilisateur.formatter(),
      pièceJustificative: { format: pièceJustificative.format },
    },
  };

  await this.publish(event);
}

export function applyChangementReprésentantLégalDemandé(
  this: ReprésentantLégalAggregate,
  {
    payload: { nomReprésentantLégal, typeReprésentantLégal },
  }: ChangementReprésentantLégalDemandéEvent,
) {
  this.demande = {
    statut: StatutChangementReprésentantLégal.demandé,
    nom: nomReprésentantLégal,
    type: TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal),
  };
}
