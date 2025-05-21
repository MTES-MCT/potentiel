import { Given as EtantDonné } from '@cucumber/cucumber';

import { Tâche } from '@potentiel-domain/tache';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';
import { RechercherTypeTâche } from '../tâche.world';

EtantDonné(
  'une tâche indiquant de {string} pour le projet lauréat',
  async function (this: PotentielWorld, tâche: RechercherTypeTâche) {
    const actualTypeTâche = this.tâcheWorld.rechercherTypeTâche(tâche);
    const identifiantProjet = this.lauréatWorld.identifiantProjet;

    const event: Tâche.TâcheAjoutéeEvent = {
      type: 'TâcheAjoutée-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        typeTâche: actualTypeTâche.type,
        ajoutéeLe: DateTime.now().formatter(),
      },
    };
    await publish(`tâche|${actualTypeTâche.type}#${identifiantProjet.formatter()}`, event);
  },
);
