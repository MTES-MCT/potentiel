import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { AbandonAggregate } from '../abandon.aggregate';
import * as StatutAbandon from '../statutAbandon.valueType';

export type AbandonAnnuléEvent = DomainEvent<
  'AbandonAnnulé-V1',
  {
    annuléLe: DateTime.RawType;
    annuléPar: IdentifiantUtilisateur.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type AnnulerOptions = {
  annuléPar: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function annuler(
  this: AbandonAggregate,
  { annuléPar, identifiantProjet }: AnnulerOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.annulé);

  const dateAnnulation = DateTime.now();

  const event: AbandonAnnuléEvent = {
    type: 'AbandonAnnulé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      annuléLe: dateAnnulation.formatter(),
      annuléPar: annuléPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyAbandonAnnulé(
  this: AbandonAggregate,
  { payload: { annuléLe } }: AbandonAnnuléEvent,
) {
  this.statut = StatutAbandon.annulé;
  this.annuléLe = DateTime.convertirEnValueType(annuléLe);
  this.demande.confirmation = undefined;
  this.accord = undefined;
  this.rejet = undefined;
}
