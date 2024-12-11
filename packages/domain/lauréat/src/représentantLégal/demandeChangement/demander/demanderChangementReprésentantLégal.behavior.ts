import { DomainError, DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import { StatutDemandeChangementReprésentantLégal, TypeReprésentantLégal } from '../..';
import { ReprésentantLégalIdentifiqueError } from '../../représentantLégalIdentique.error';

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
  pièceJustificative?: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateDemande: DateTime.ValueType;
  projetAbandonné: boolean;
  projetAvecDemandeAbandonEnCours: boolean;
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
    projetAbandonné,
    projetAvecDemandeAbandonEnCours,
  }: DemanderChangementOptions,
) {
  if (projetAvecDemandeAbandonEnCours) {
    throw new ProjetAvecDemandeAbandonEnCoursError();
  }

  if (projetAbandonné) {
    throw new ProjetAbandonnéError();
  }

  if (!pièceJustificative) {
    throw new PièceJustificativeObligatoireError();
  }

  if (
    this.représentantLégal.nom === nomReprésentantLégal &&
    this.représentantLégal.type.estÉgaleÀ(typeReprésentantLégal)
  ) {
    throw new ReprésentantLégalIdentifiqueError();
  }

  if (typeReprésentantLégal.estInconnu()) {
    throw new ReprésentantLégalTypeInconnuError();
  }

  if (this.demande) {
    this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutDemandeChangementReprésentantLégal.demandé,
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
    statut: StatutDemandeChangementReprésentantLégal.demandé,
    nom: nomReprésentantLégal,
    type: TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal),
  };
}

class ReprésentantLégalTypeInconnuError extends DomainError {
  constructor() {
    super('Le représentant légal ne peut pas avoir de type inconnu');
  }
}

class PièceJustificativeObligatoireError extends InvalidOperationError {
  constructor() {
    super('Les pièces justificatives sont obligatoires');
  }
}

class ProjetAbandonnéError extends DomainError {
  constructor() {
    super('Impossible de demander le changement de réprésentant légal pour un projet abandonné');
  }
}

class ProjetAvecDemandeAbandonEnCoursError extends DomainError {
  constructor() {
    super(
      "Impossible de demander le changement de réprésentant légal car une demande d'abandon est en cours pour le projet",
    );
  }
}
