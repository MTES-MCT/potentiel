import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import * as TypePlanifiéeTâche from '../typeTâchePlanifiée.valueType';
import { TâchePlanifiéeAggregate } from '../tâchePlanifiée.aggregate';

export type TâchePlanifiéeAjoutéeEvent = DomainEvent<
  'TâchePlanifiéeAjoutée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâchePlanifiée: TypePlanifiéeTâche.RawType;
    ajoutéeLe: DateTime.RawType;
    àExécuterLe: DateTime.RawType;
  }
>;

export type AjouterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typeTâchePlanifiée: TypePlanifiéeTâche.ValueType;
  àExecuterLe: DateTime.ValueType;
};

export async function ajouter(
  this: TâchePlanifiéeAggregate,
  { identifiantProjet, typeTâchePlanifiée, àExecuterLe }: AjouterOptions,
) {
  if (!this.àExécuterLe.estÉgaleÀ(àExecuterLe)) {
    const event: TâchePlanifiéeAjoutéeEvent = {
      type: 'TâchePlanifiéeAjoutée-V1',
      payload: {
        ajoutéeLe: DateTime.now().formatter(),
        identifiantProjet: identifiantProjet.formatter(),
        typeTâchePlanifiée: typeTâchePlanifiée.type,
        àExécuterLe: àExecuterLe.formatter(),
      },
    };
    await this.publish(event);
  }
}

export function applyTâchePlanifiéeAjoutée(
  this: TâchePlanifiéeAggregate,
  { payload: { typeTâchePlanifiée: type, àExécuterLe } }: TâchePlanifiéeAjoutéeEvent,
) {
  this.typeTâche = TypePlanifiéeTâche.convertirEnValueType(type);
  this.àExécuterLe = DateTime.convertirEnValueType(àExécuterLe);
}
