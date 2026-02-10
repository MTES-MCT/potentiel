import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

import { TâchePlanifiéeExecutéeEvent } from '../../../tâche-planifiée/index.js';
import { TypeTâchePlanifiéeRaccordement } from '../../index.js';
import { AjouterTâchePlanifiéeCommand } from '../../../tâche-planifiée/ajouter/ajouterTâchePlanifiée.command.js';
import { IdentifiantProjet } from '../../../../index.js';

export const handleTâchePlanifiéeExecutée = async ({
  payload: { typeTâchePlanifiée, identifiantProjet, exécutéeLe },
}: TâchePlanifiéeExecutéeEvent) => {
  if (
    typeTâchePlanifiée === TypeTâchePlanifiéeRaccordement.relanceDemandeComplèteRaccordement.type
  ) {
    await mediator.send<AjouterTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        typeTâchePlanifiée: TypeTâchePlanifiéeRaccordement.relanceDemandeComplèteRaccordement.type,
        àExécuterLe: DateTime.convertirEnValueType(exécutéeLe).ajouterNombreDeMois(1),
      },
    });
  }
};
