import { DomainError, DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ReprésentantLégalAggregate } from '../représentantLégal.aggregate';
import { TypeReprésentantLégal } from '..';
import { ReprésentantLégalIdentifiqueError } from '../représentantLégalIdentique.error';

export type ReprésentantLégalModifiéEvent = DomainEvent<
  'ReprésentantLégalModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
  }
>;

export type ModifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  dateModification: DateTime.ValueType;
  demandeDeChangementEnCours: boolean;
};

export async function modifier(
  this: ReprésentantLégalAggregate,
  {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    dateModification,
    identifiantUtilisateur,
    demandeDeChangementEnCours,
  }: ModifierOptions,
) {
  if (demandeDeChangementEnCours) {
    throw new DemandeDeChangementEnCoursError();
  }

  if (
    this.représentantLégal.nom === nomReprésentantLégal &&
    this.représentantLégal.type.estÉgaleÀ(typeReprésentantLégal)
  ) {
    throw new ReprésentantLégalIdentifiqueError();
  }

  const event: ReprésentantLégalModifiéEvent = {
    type: 'ReprésentantLégalModifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      nomReprésentantLégal,
      typeReprésentantLégal: typeReprésentantLégal.formatter(),
      modifiéLe: dateModification.formatter(),
      modifiéPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyReprésentantLégalModifié(
  this: ReprésentantLégalAggregate,
  { payload: { nomReprésentantLégal, typeReprésentantLégal } }: ReprésentantLégalModifiéEvent,
) {
  this.représentantLégal = {
    nom: nomReprésentantLégal,
    type: TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal),
  };
}

class DemandeDeChangementEnCoursError extends DomainError {
  constructor() {
    super(
      'Impossible de modifier le représentant légal car une demande de changement est déjà en cours',
    );
  }
}
