import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { match } from 'ts-pattern';

import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';
import { TypeTâchePlanifiée } from '../tâchePlanifiée.world';

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
) {
  const event: Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent = {
    type: 'TâchePlanifiéeExecutée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      typeTâchePlanifiée,
      exécutéeLe: DateTime.now().formatter(),
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
  /une tâche planifiée (.*)pour le projet lauréat avec :/,
  async function (this: PotentielWorld, statutTâche: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    const { identifiantProjet } = this.lauréatWorld;
    const typeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(
      exemple['type'] as TypeTâchePlanifiée,
    ).type;

    await ajouterTâchePlanifiée(
      identifiantProjet,
      typeTâche,
      new Date(exemple["date d'exécution"]),
    );

    await match(statutTâche.trim())
      .with('', () => Promise.resolve())
      .with('annulée', () => annulerTâche(identifiantProjet, typeTâche))
      .with('exécutée', () => exécuterTâche(identifiantProjet, typeTâche))
      .otherwise(() => {
        throw new Error('Statut inconnu');
      });
  },
);
