import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { RecoursAggregate } from '../recours.aggregate';
import * as StatutRecours from '../statutRecours.valueType';

export type RecoursAnnuléEvent = DomainEvent<
  'RecoursAnnulé-V1',
  {
    annuléLe: DateTime.RawType;
    annuléPar: IdentifiantUtilisateur.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type AnnulerOptions = {
  dateAnnulation: DateTime.ValueType;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function annuler(
  this: RecoursAggregate,
  { dateAnnulation, identifiantUtilisateur, identifiantProjet }: AnnulerOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.annulé);

  const event: RecoursAnnuléEvent = {
    type: 'RecoursAnnulé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      annuléLe: dateAnnulation.formatter(),
      annuléPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyRecoursAnnulé(
  this: RecoursAggregate,
  { payload: { annuléLe } }: RecoursAnnuléEvent,
) {
  this.statut = StatutRecours.annulé;
  this.annuléLe = DateTime.convertirEnValueType(annuléLe);
  this.accord = undefined;
  this.rejet = undefined;
}
