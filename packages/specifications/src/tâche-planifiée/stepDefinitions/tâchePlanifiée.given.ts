import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { match } from 'ts-pattern';

import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world.js';
import { TypeTâchePlanifiée } from '../tâchePlanifiée.world.js';

async function ajouterTâchePlanifiée(
  identifiantProjet: IdentifiantProjet.ValueType,
  typeTâchePlanifiée: string,
  àExécuterLe: Date,
) {
  const event: Lauréat.TâchePlanifiée.TâchePlanifiéeAjoutéeEvent = {
    type: 'TâchePlanifiéeAjoutée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      ajoutéeLe: DateTime.now().formatter(),
      àExécuterLe: DateTime.convertirEnValueType(àExécuterLe).formatter(),
      typeTâchePlanifiée,
    },
  };
  await publish(`tâche-planifiée|${typeTâchePlanifiée}#${event.payload.identifiantProjet}`, event);
}

async function exécuterTâche(
  identifiantProjet: IdentifiantProjet.ValueType,
  typeTâchePlanifiée: string,
  exécutéeLe: Date,
) {
  const event: Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent = {
    type: 'TâchePlanifiéeExecutée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      typeTâchePlanifiée,
      exécutéeLe: DateTime.convertirEnValueType(exécutéeLe).formatter(),
    },
  };
  await publish(`tâche-planifiée|${typeTâchePlanifiée}#${event.payload.identifiantProjet}`, event);
}

async function annulerTâche(
  identifiantProjet: IdentifiantProjet.ValueType,
  typeTâchePlanifiée: string,
) {
  const event: Lauréat.TâchePlanifiée.TâchePlanifiéeAnnuléeEvent = {
    type: 'TâchePlanifiéeAnnulée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      typeTâchePlanifiée,
      annuléeLe: DateTime.now().formatter(),
    },
  };
  await publish(`tâche-planifiée|${typeTâchePlanifiée}#${event.payload.identifiantProjet}`, event);
}

EtantDonné(
  /une tâche planifiée (ajoutée|annulée|exécutée) pour le projet lauréat avec :/,
  async function (
    this: PotentielWorld,
    statutTâche: 'ajoutée' | 'annulée' | 'exécutée',
    dataTable: DataTable,
  ) {
    const exemple = dataTable.rowsHash();

    if (!exemple['type']) {
      throw new Error(`La table d'exemple doit contenir le champ "type"`);
    }

    if (!exemple["date d'exécution"]) {
      throw new Error(
        `La table d'exemple doit contenir le champ "date d'exécution" au format YYYY-MM-DD`,
      );
    }

    const { identifiantProjet } = this.lauréatWorld;
    const typeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(
      exemple['type'] as TypeTâchePlanifiée,
    ).type;

    await match(statutTâche)
      .with('ajoutée', () =>
        ajouterTâchePlanifiée(identifiantProjet, typeTâche, new Date(exemple["date d'exécution"])),
      )
      .with('annulée', async () => {
        await ajouterTâchePlanifiée(
          identifiantProjet,
          typeTâche,
          new Date(exemple["date d'exécution"]),
        );
        await annulerTâche(identifiantProjet, typeTâche);
      })
      .with('exécutée', async () => {
        const executéeLe = exemple['exécutée le'] ? new Date(exemple['exécutée le']) : new Date();

        await ajouterTâchePlanifiée(
          identifiantProjet,
          typeTâche,
          new Date(exemple["date d'exécution"]),
        );
        await exécuterTâche(identifiantProjet, typeTâche, executéeLe);
      })
      .exhaustive();
  },
);
