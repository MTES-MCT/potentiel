import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { PuissanceAggregate } from '../../puissance.aggregate';
import { AutoritéCompétente, StatutChangementPuissance } from '../..';
import { DemandeDeChangementInexistanteError } from '../errors';

export type ChangementPuissanceAnnuléEvent = DomainEvent<
  'ChangementPuissanceAnnulé-V1',
  {
    annuléLe: DateTime.RawType;
    annuléPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    autoritéCompétente?: AutoritéCompétente.RawType;
  }
>;

export type AnnulerOptions = {
  dateAnnulation: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  autoritéCompétente?: AutoritéCompétente.ValueType;
};

export async function annulerDemandeChangement(
  this: PuissanceAggregate,
  { dateAnnulation, identifiantUtilisateur, identifiantProjet }: AnnulerOptions,
) {
  if (!this.demande) {
    throw new DemandeDeChangementInexistanteError();
  }

  this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementPuissance.annulé,
  );

  const event: ChangementPuissanceAnnuléEvent = {
    type: 'ChangementPuissanceAnnulé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      annuléLe: dateAnnulation.formatter(),
      annuléPar: identifiantUtilisateur.formatter(),
      autoritéCompétente: this.demande.autoritéCompétente,
    },
  };

  await this.publish(event);
}

export function applyChangementPuissanceAnnulé(this: PuissanceAggregate) {
  this.demande = undefined;
}
