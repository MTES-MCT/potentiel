import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../../index.js';
import type { AjouterTâchePlanifiéeCommand } from '../../../tâche-planifiée/ajouter/ajouterTâchePlanifiée.command.js';
import type { TâchePlanifiéeExecutéeEvent } from '../../../tâche-planifiée/index.js';
import { TypeTâchePlanifiéeRaccordement } from '../../index.js';

export const handleTâchePlanifiéeExecutée = async ({
  payload: { typeTâchePlanifiée, identifiantProjet, exécutéeLe },
}: TâchePlanifiéeExecutéeEvent) => {
  if (
    typeTâchePlanifiée ===
    TypeTâchePlanifiéeRaccordement.relanceTransmissionDeLaDemandeComplèteRaccordement.type
  ) {
    await mediator.send<AjouterTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        typeTâchePlanifiée:
          TypeTâchePlanifiéeRaccordement.relanceTransmissionDeLaDemandeComplèteRaccordement.type,
        àExécuterLe: DateTime.convertirEnValueType(exécutéeLe).ajouterNombreDeMois(1),
      },
    });
  }
};
