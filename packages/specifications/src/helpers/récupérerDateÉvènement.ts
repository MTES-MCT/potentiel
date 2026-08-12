import { assert } from 'chai';

import { DateTime } from '@potentiel-domain/common';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import type { PotentielWorld } from '../potentiel.world.js';

const EVENTS: Record<
  string,
  { catégorie: 'éliminé' | 'recours' | 'lauréat'; type: string; dateChamp: string }
> = {
  'de notification du projet éliminé': {
    catégorie: 'éliminé',
    type: 'ÉliminéNotifié-V1',
    dateChamp: 'notifiéLe',
  },
  'de demande de recours': {
    catégorie: 'recours',
    type: 'RecoursDemandé-V1',
    dateChamp: 'demandéLe',
  },
  "d'accord du recours": {
    catégorie: 'recours',
    type: 'RecoursAccordé-V%',
    dateChamp: 'dateRéponseSignée',
  },
  'de notification du projet lauréat': {
    catégorie: 'lauréat',
    type: 'LauréatNotifié-V%',
    dateChamp: 'notifiéLe',
  },
};

type RécupérerDateÉvènementProps = {
  potentielWorld: PotentielWorld;
  eventLabel: string;
};

export const récupérerDateÉvènement = async ({
  potentielWorld,
  eventLabel,
}: RécupérerDateÉvènementProps) => {
  const repère = EVENTS[eventLabel.trim()];
  assert(repère, `Label d'évènement inconnu : "${eventLabel}"`);

  const events = await executeSelect<{ payload: Record<string, string> }>(
    `select payload from event_store.event_stream
     where stream_id = $1 and type like $2
     order by created_at asc
     limit 1`,
    `${repère.catégorie}|${potentielWorld.éliminéWorld.identifiantProjet.formatter()}`,
    repère.type,
  );

  assert(
    events.length > 0,
    `Aucun évènement "${eventLabel}" pour le projet éliminé ${potentielWorld.éliminéWorld.identifiantProjet.formatter()}`,
  );

  return DateTime.convertirEnValueType(events[0].payload[repère.dateChamp]);
};
