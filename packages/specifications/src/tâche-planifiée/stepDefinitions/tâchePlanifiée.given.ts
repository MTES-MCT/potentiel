import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';
import { RechercherStatutTâchePlanifiée, TypeTâchePlanifiée } from '../tâchePlanifiée.world';

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
  'une tâche {string} pour le projet lauréat avec :',
  async function (
    this: PotentielWorld,
    statutTâche: RechercherStatutTâchePlanifiée,
    dataTable: DataTable,
  ) {
    const exemple = dataTable.rowsHash();
    const { identifiantProjet } = this.lauréatWorld;
    const typeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(
      exemple['type'] as TypeTâchePlanifiée,
    ).type;
    const actualStatutTâche = this.tâchePlanifiéeWorld.rechercherStatutTâchePlanifiée(statutTâche);
    await ajouterTâchePlanifiée(
      identifiantProjet,
      typeTâche,
      new Date(exemple["date d'exécution"]),
    );

    if (actualStatutTâche.estAnnulé()) {
      await annulerTâche(identifiantProjet, typeTâche);
    }
    if (actualStatutTâche.estExécuté()) {
      await exécuterTâche(identifiantProjet, typeTâche);
    }
  },
);
