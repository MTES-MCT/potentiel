import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { DateTime } from '@potentiel-domain/common';

import { TâchePlanifiéeExecutéeEvent } from '../../tâche-planifiée';
import { TypeTâchePlanifiéeGarantiesFinancières } from '..';
import { AjouterTâchePlanifiéeCommand } from '../../tâche-planifiée/ajouter/ajouterTâchePlanifiée.command';
import { ÉchoirGarantiesFinancièresCommand } from '../actuelles/échoir/échoirGarantiesFinancières.command';
import { IdentifiantProjet } from '../../..';

export const handleTâchePlanifiéeExecutée = async ({
  payload: { exécutéeLe, identifiantProjet, typeTâchePlanifiée },
}: TâchePlanifiéeExecutéeEvent) => {
  await match(typeTâchePlanifiée)
    .with(TypeTâchePlanifiéeGarantiesFinancières.échoir.type, () =>
      mediator.send<ÉchoirGarantiesFinancièresCommand>({
        type: 'Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières',
        data: {
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
          échuLe: DateTime.convertirEnValueType(exécutéeLe),
        },
      }),
    )
    .with(TypeTâchePlanifiéeGarantiesFinancières.rappelEnAttente.type, () =>
      mediator.send<AjouterTâchePlanifiéeCommand>({
        type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
        data: {
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
          typeTâchePlanifiée,
          àExécuterLe: DateTime.convertirEnValueType(exécutéeLe).ajouterNombreDeMois(1),
        },
      }),
    )
    .otherwise(() => Promise.resolve());
};
