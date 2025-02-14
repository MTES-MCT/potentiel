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
  àExécuterLe: DateTime.ValueType;
};

export async function ajouter(this: TâchePlanifiéeAggregate, { àExécuterLe }: AjouterOptions) {
  if (!this.àExécuterLe.estÉgaleÀ(àExécuterLe) || this.statut.estAnnulé()) {
    const event: TâchePlanifiéeAjoutéeEvent = {
      type: 'TâchePlanifiéeAjoutée-V1',
      payload: {
        ajoutéeLe: DateTime.now().formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        typeTâchePlanifiée: this.typeTâchePlanifiée,
        àExécuterLe: àExécuterLe.formatter(),
      },
    };
    await this.publish(event);
  }
}

export function applyTâchePlanifiéeAjoutée(
  this: TâchePlanifiéeAggregate,
  { payload: { àExécuterLe } }: TâchePlanifiéeAjoutéeEvent,
) {
  this.àExécuterLe = DateTime.convertirEnValueType(àExécuterLe);
  this.statut = StatutTâchePlanifiée.enAttenteExécution;
}
