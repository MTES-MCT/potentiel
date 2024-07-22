import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import * as StatutTâchePlanifiée from '../statutTâchePlanifiée.valueType';
import * as TypeTâchePlanifiée from '../typeTâchePlanifiée.valueType';
import { TâchePlanifiéeAggregate } from '../tâchePlanifiée.aggregate';

export type TâchePlanifiéeAjoutéeEvent = DomainEvent<
  'TâchePlanifiéeAjoutée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâchePlanifiée: TypeTâchePlanifiée.RawType;
    ajoutéeLe: DateTime.RawType;
    àExécuterLe: DateTime.RawType;
  }
>;

export type AjouterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typeTâchePlanifiée: TypeTâchePlanifiée.ValueType;
  àExécuterLe: DateTime.ValueType;
};

export async function ajouter(
  this: TâchePlanifiéeAggregate,
  { identifiantProjet, typeTâchePlanifiée, àExécuterLe }: AjouterOptions,
) {
  if (!this.àExécuterLe.estÉgaleÀ(àExécuterLe)) {
    const event: TâchePlanifiéeAjoutéeEvent = {
      type: 'TâchePlanifiéeAjoutée-V1',
      payload: {
        ajoutéeLe: DateTime.now().formatter(),
        identifiantProjet: identifiantProjet.formatter(),
        typeTâchePlanifiée: typeTâchePlanifiée.type,
        àExécuterLe: àExécuterLe.formatter(),
      },
    };
    await this.publish(event);
  }
}

export function applyTâchePlanifiéeAjoutée(
  this: TâchePlanifiéeAggregate,
  { payload: { typeTâchePlanifiée: type, àExécuterLe } }: TâchePlanifiéeAjoutéeEvent,
) {
  this.typeTâche = TypeTâchePlanifiée.convertirEnValueType(type);
  this.àExécuterLe = DateTime.convertirEnValueType(àExécuterLe);
  this.statut = StatutTâchePlanifiée.enAttenteExécution;
}
