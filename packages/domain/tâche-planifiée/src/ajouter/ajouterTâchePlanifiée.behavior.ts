import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import * as StatutTâchePlanifiée from '../statutTâchePlanifiée.valueType';
import { TâchePlanifiéeAggregate } from '../tâchePlanifiée.aggregate';

export type TâchePlanifiéeAjoutéeEvent = DomainEvent<
  'TâchePlanifiéeAjoutée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâchePlanifiée: string;
    ajoutéeLe: DateTime.RawType;
    àExécuterLe: DateTime.RawType;
  }
>;

export type AjouterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typeTâchePlanifiée: string;
  àExécuterLe: DateTime.ValueType;
};

export async function ajouter(
  this: TâchePlanifiéeAggregate,
  { identifiantProjet, typeTâchePlanifiée, àExécuterLe }: AjouterOptions,
) {
  if (!this.àExécuterLe.estÉgaleÀ(àExécuterLe) || this.statut.estAnnulé()) {
    const event: TâchePlanifiéeAjoutéeEvent = {
      type: 'TâchePlanifiéeAjoutée-V1',
      payload: {
        ajoutéeLe: DateTime.now().formatter(),
        identifiantProjet: identifiantProjet.formatter(),
        typeTâchePlanifiée,
        àExécuterLe: àExécuterLe.formatter(),
      },
    };
    await this.publish(event);
  }
}

export function applyTâchePlanifiéeAjoutée(
  this: TâchePlanifiéeAggregate,
  { payload: { typeTâchePlanifiée, àExécuterLe } }: TâchePlanifiéeAjoutéeEvent,
) {
  this.typeTâchePlanifiée = typeTâchePlanifiée;
  this.àExécuterLe = DateTime.convertirEnValueType(àExécuterLe);
  this.statut = StatutTâchePlanifiée.enAttenteExécution;
}
