import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Recours } from '@potentiel-domain/elimine';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { DateTime } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';

export type SubscriptionEvent = (Recours.RecoursEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Eliminé.Recours', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<Recours.RecoursEntity>(`recours|${payload.id}`);
    } else {
      const { identifiantProjet } = payload;

      const recours = await findProjection<Recours.RecoursEntity>(`recours|${identifiantProjet}`);

      const recoursDefaultValue: Omit<Recours.RecoursEntity, 'type'> = {
        identifiantProjet,
        projet: {
          nom: '',
          appelOffre: '',
          numéroCRE: '',
          période: '',
          famille: undefined,
          région: '',
        },
        demande: {
          demandéLe: '',
          demandéPar: '',
          pièceJustificative: {
            format: '',
          },
          raison: '',
        },
        statut: 'demandé',
        misÀJourLe: DateTime.now().formatter(),
      };

      const recoursToUpsert: Omit<Recours.RecoursEntity, 'type'> = Option.isSome(recours)
        ? recours
        : recoursDefaultValue;

      switch (type) {
        case 'RecoursDemandé-V1':
          const projet = await CandidatureAdapter.récupérerProjetAdapter(identifiantProjet);

          if (Option.isNone(projet)) {
            getLogger('System.Projector.Eliminé.Recours.RecoursDemandé').warn(`Projet inconnu !`, {
              identifiantProjet,
              message: event,
            });
          }

          await upsertProjection<Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
            ...recoursDefaultValue,
            projet: {
              nom: Option.isSome(projet) ? projet.nom : 'Projet inconnu',
              appelOffre: Option.isSome(projet) ? projet.appelOffre : `N/A`,
              période: Option.isSome(projet) ? projet.période : `N/A`,
              famille: Option.isSome(projet) ? projet.famille : undefined,
              région: Option.isSome(projet) ? projet.localité.région : '',
              numéroCRE: Option.isSome(projet) ? projet.numéroCRE : '',
            },
            demande: {
              demandéLe: payload.demandéLe,
              demandéPar: payload.demandéPar,
              raison: payload.raison,
              pièceJustificative: {
                format: payload.pièceJustificative.format,
              },
            },
            statut: 'demandé',
            misÀJourLe: payload.demandéLe,
          });
          break;
        case 'RecoursAccordé-V1':
          await upsertProjection<Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
            ...recoursToUpsert,
            demande: {
              ...recoursToUpsert.demande,
              accord: {
                accordéLe: payload.accordéLe,
                accordéPar: payload.accordéPar,
                réponseSignée: {
                  format: payload.réponseSignée.format,
                },
              },
            },
            statut: 'accordé',
            misÀJourLe: payload.accordéLe,
          });
          break;
        case 'RecoursRejeté-V1':
          await upsertProjection<Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
            ...recoursToUpsert,
            demande: {
              ...recoursToUpsert.demande,
              rejet: {
                rejetéLe: payload.rejetéLe,
                rejetéPar: payload.rejetéPar,
                réponseSignée: {
                  format: payload.réponseSignée.format,
                },
              },
            },
            statut: 'rejeté',
            misÀJourLe: payload.rejetéLe,
          });
          break;
        case 'RecoursAnnulé-V1':
          await removeProjection(`recours|${identifiantProjet}`);
          break;
      }
    }
  };

  mediator.register('System.Projector.Eliminé.Recours', handler);
};
