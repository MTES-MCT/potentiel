import { DomainError } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ReprésentantLégalAggregate } from '../représentantLégal.aggregate';
import { ReprésentantLégalIdentifiqueError } from '../représentantLégalIdentique.error';

export type ModifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;
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
    this.représentantLégal?.nom === nomReprésentantLégal &&
    this.représentantLégal.type.estÉgaleÀ(typeReprésentantLégal)
  ) {
    throw new ReprésentantLégalIdentifiqueError();
  }

  const event: Lauréat.ReprésentantLégal.ReprésentantLégalModifiéEvent = {
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
  {
    payload: { nomReprésentantLégal, typeReprésentantLégal },
  }: Lauréat.ReprésentantLégal.ReprésentantLégalModifiéEvent,
) {
  this.représentantLégal = {
    nom: nomReprésentantLégal,
    type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.convertirEnValueType(
      typeReprésentantLégal,
    ),
  };
}

class DemandeDeChangementEnCoursError extends DomainError {
  constructor() {
    super(
      'Impossible de modifier le représentant légal car une demande de changement est déjà en cours',
    );
  }
}
