import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { AbandonAggregate } from '../abandon.aggregate';

export type AnnulerOptions = {
  dateAnnulation: DateTime.ValueType;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function annuler(
  this: AbandonAggregate,
  { dateAnnulation, identifiantUtilisateur, identifiantProjet }: AnnulerOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(Lauréat.Abandon.StatutAbandon.annulé);

  const event: Lauréat.Abandon.AbandonAnnuléEvent = {
    type: 'AbandonAnnulé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      annuléLe: dateAnnulation.formatter(),
      annuléPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyAbandonAnnulé(
  this: AbandonAggregate,
  { payload: { annuléLe } }: Lauréat.Abandon.AbandonAnnuléEvent,
) {
  this.statut = Lauréat.Abandon.StatutAbandon.annulé;
  this.annuléLe = DateTime.convertirEnValueType(annuléLe);
  this.accord = undefined;
  this.rejet = undefined;
}
