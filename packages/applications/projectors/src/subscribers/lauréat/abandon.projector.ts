import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Abandon } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';
import { getLogger } from '@potentiel-libraries/monitoring';
import { DateTime } from '@potentiel-domain/common';

export type SubscriptionEvent = (Abandon.AbandonEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Abandon', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<Abandon.AbandonEntity>(`abandon|${payload.id}`);
      await removeProjection<Abandon.AbandonAvecRecandidatureSansPreuveProjection>(
        `abandon-avec-recandidature-sans-preuve|${payload.id}`,
      );
    } else {
      const { identifiantProjet } = payload;

      const abandon = await findProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`);

      const abandonDefaultValue: Omit<Abandon.AbandonEntity, 'type'> = {
        identifiantProjet,
        demande: {
          demandéLe: '',
          demandéPar: '',
          raison: '',
          estUneRecandidature: false,
        },
        statut: 'demandé',
        misÀJourLe: DateTime.now().formatter(),
      };

      const abandonToUpsert: Omit<Abandon.AbandonEntity, 'type'> = Option.isSome(abandon)
        ? abandon
        : abandonDefaultValue;

      switch (type) {
        case 'AbandonDemandé-V1':
          const projet = await CandidatureAdapter.récupérerCandidatureAdapter(identifiantProjet);

          if (Option.isNone(projet)) {
            getLogger().error(new Error(`Projet inconnu !`), { identifiantProjet, message: event });
          }

          await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
            ...abandonDefaultValue,
            projet: Option.isSome(projet)
              ? {
                  appelOffre: projet.appelOffre,
                  nom: projet.nom,
                  numéroCRE: projet.numéroCRE,
                  période: projet.période,
                  région: projet.localité.région,
                  famille: projet.famille,
                }
              : undefined,
            demande: {
              pièceJustificative: payload.pièceJustificative
                ? {
                    format: payload.pièceJustificative.format,
                  }
                : undefined,

              demandéLe: payload.demandéLe,
              demandéPar: payload.demandéPar,
              raison: payload.raison,
              estUneRecandidature: payload.recandidature,
              recandidature: payload.recandidature
                ? {
                    statut: Abandon.StatutPreuveRecandidature.enAttente.statut,
                  }
                : undefined,
            },
            statut: 'demandé',
            misÀJourLe: payload.demandéLe,
          });
          break;
        case 'AbandonAccordé-V1':
          await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
            ...abandonToUpsert,
            demande: {
              ...abandonToUpsert.demande,
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
        case 'AbandonRejeté-V1':
          await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
            ...abandonToUpsert,
            demande: {
              ...abandonToUpsert.demande,
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
        case 'ConfirmationAbandonDemandée-V1':
          await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
            ...abandonToUpsert,
            demande: {
              ...abandonToUpsert.demande,
              confirmation: {
                demandéeLe: payload.confirmationDemandéeLe,
                demandéePar: payload.confirmationDemandéePar,
                réponseSignée: {
                  format: payload.réponseSignée.format,
                },
              },
            },
            statut: 'confirmation-demandée',
            misÀJourLe: payload.confirmationDemandéeLe,
          });
          break;
        case 'AbandonConfirmé-V1':
          await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
            ...abandonToUpsert,
            demande: {
              ...abandonToUpsert.demande,
              confirmation: {
                ...abandonToUpsert.demande.confirmation!,
                confirméLe: payload.confirméLe,
                confirméPar: payload.confirméPar,
              },
            },
            statut: 'confirmé',
            misÀJourLe: payload.confirméLe,
          });
          break;
        case 'PreuveRecandidatureTransmise-V1':
          await upsertProjection<Abandon.AbandonEntity>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            demande: {
              ...abandonToUpsert.demande,
              recandidature: {
                ...abandonToUpsert.demande.recandidature!,
                statut: Abandon.StatutPreuveRecandidature.transmise.statut,
                preuve: {
                  ...abandonToUpsert.demande.recandidature?.preuve!,
                  identifiantProjet: payload.preuveRecandidature,
                  transmiseLe: payload.transmiseLe,
                  transmisePar: payload.transmisePar,
                },
              },
            },
          });
          await removeProjection<Abandon.AbandonAvecRecandidatureSansPreuveProjection>(
            `abandon-avec-recandidature-sans-preuve|${identifiantProjet}`,
          );
          break;
        case 'PreuveRecandidatureDemandée-V1':
          await upsertProjection<Abandon.AbandonEntity>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            demande: {
              ...abandonToUpsert.demande!,
              recandidature: {
                ...abandonToUpsert.demande.recandidature!,
                statut: Abandon.StatutPreuveRecandidature.enAttente.statut,
                preuve: {
                  ...abandonToUpsert.demande.recandidature?.preuve!,
                  demandéeLe: payload.demandéeLe,
                },
              },
            },
          });
          await upsertProjection<Abandon.AbandonAvecRecandidatureSansPreuveProjection>(
            `abandon-avec-recandidature-sans-preuve|${identifiantProjet}`,
            payload,
          );
          break;
        case 'AbandonAnnulé-V1':
          await removeProjection(`abandon|${identifiantProjet}`);
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat.Abandon', handler);
};
