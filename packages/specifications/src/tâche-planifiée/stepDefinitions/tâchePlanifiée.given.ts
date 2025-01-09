import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  TâchePlanifiéeAjoutéeEvent,
  TâchePlanifiéeExecutéeEvent,
} from '@potentiel-domain/tache-planifiee';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { TâchePlanifiéeAnnuléeEvent } from '@potentiel-domain/tache-planifiee';

import { PotentielWorld } from '../../potentiel.world';
import { RechercherStatutTâchePlanifiée, TypeTâchePlanifiée } from '../tâchePlanifiée.world';

async function ajouterTâche(
  identifiantProjet: IdentifiantProjet.ValueType,
  typeTâchePlanifiée: string,
  àExécuterLe: Date,
) {
  const event: TâchePlanifiéeAjoutéeEvent = {
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
  const event: TâchePlanifiéeExecutéeEvent = {
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
  const event: TâchePlanifiéeAnnuléeEvent = {
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
  'une tâche {string} pour le projet {string} avec :',
  async function (
    this: PotentielWorld,
    statutTâche: RechercherStatutTâchePlanifiée,
    nomProjet: string,
    dataTable: DataTable,
  ) {
    const exemple = dataTable.rowsHash();
    const projet = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const typeTâche = this.tâchePlanifiéeWorld.rechercherTypeTâchePlanifiée(
      exemple['type'] as TypeTâchePlanifiée,
    ).type;
    const actualStatutTâche = this.tâchePlanifiéeWorld.rechercherStatutTâchePlanifiée(statutTâche);
    await ajouterTâche(projet.identifiantProjet, typeTâche, new Date(exemple["date d'exécution"]));

    if (actualStatutTâche.estAnnulé()) {
      await annulerTâche(projet.identifiantProjet, typeTâche);
    }
    if (actualStatutTâche.estExécuté()) {
      await exécuterTâche(projet.identifiantProjet, typeTâche);
    }
  },
);
