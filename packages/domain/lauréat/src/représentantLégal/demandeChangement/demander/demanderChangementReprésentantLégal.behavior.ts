import { DomainError, DomainEvent } from '@potentiel-domain/core';
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
    piècesJustificatives: Array<{
      format: string;
    }>;
  }
>;

export type DemanderChangementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  piècesJustificatives: Array<DocumentProjet.ValueType>;
  identifiantUtilisateur: Email.ValueType;
  dateDemande: DateTime.ValueType;
};

export async function demander(
  this: ReprésentantLégalAggregate,
  {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    piècesJustificatives,
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

  if (!piècesJustificatives.length) {
    throw new PiècesJustificativesObligatoireError();
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
      piècesJustificatives: piècesJustificatives.map((pj) => ({
        format: pj.format,
      })),
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

class PiècesJustificativesObligatoireError extends DomainError {
  constructor() {
    super('Les pièces justificatives sont obligatoires');
  }
}
