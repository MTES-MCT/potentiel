// Third party

// Workspaces
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import * as StatutChangementReprésentantLégal from '../statutChangementReprésentantLégal.valueType';
import { TypeReprésentantLégal } from '../..';

export type ChangementReprésentantLégalAccordéEvent = DomainEvent<
  'ChangementReprésentantLégalAccordé-V1',
  {
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;

export type AccorderOptions = {
  dateAccord: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};

export async function accorder(
  this: ReprésentantLégalAggregate,
  {
    dateAccord,
    identifiantUtilisateur,
    identifiantProjet,
    réponseSignée,
    nomReprésentantLégal,
    typeReprésentantLégal,
  }: AccorderOptions,
) {
  if (!this.demande) {
    throw new DemandeChangementInexistanteError();
  }
  this.demande?.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementReprésentantLégal.accordé,
  );

  const event: ChangementReprésentantLégalAccordéEvent = {
    type: 'ChangementReprésentantLégalAccordé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
      accordéLe: dateAccord.formatter(),
      accordéPar: identifiantUtilisateur.formatter(),
      nomReprésentantLégal,
      typeReprésentantLégal: typeReprésentantLégal.formatter(),
    },
  };

  await this.publish(event);
}

export function applyChangementReprésentantLégalAccordé(
  this: ReprésentantLégalAggregate,
  {
    payload: { accordéLe, réponseSignée, nomReprésentantLégal, typeReprésentantLégal },
  }: ChangementReprésentantLégalAccordéEvent,
) {
  if (this.demande) {
    this.demande.statut = StatutChangementReprésentantLégal.accordé;

    this.demande.accord = {
      accordéLe: DateTime.convertirEnValueType(accordéLe),
      nom: nomReprésentantLégal,
      type: TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal),
      réponseSignée,
    };
  }
}

class DemandeChangementInexistanteError extends InvalidOperationError {
  constructor() {
    super(`Aucun changement de représentant légal n'est en cours`);
  }
}
