import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Recours } from '@potentiel-domain/elimine';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';

import { DateTime } from '@potentiel-domain/common';
import { removeProjection } from '../../infrastructure/removeProjection';
import { getLogger } from '@potentiel-libraries/monitoring';
import { upsertProjection } from '../../infrastructure/upsertProjection';

export type SubscriptionEvent = (Recours.RecoursEvent & Event) | RebuildTriggered;

export type Execute = Message<'EXECUTE_RECOURS_PROJECTOR', SubscriptionEvent>;

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
        nomProjet: '',
        appelOffre: '',
        période: '',
        famille: undefined,
        demandeDemandéLe: '',
        demandeDemandéPar: '',
        demandePièceJustificativeFormat: '',
        demandeRaison: '',
        statut: 'demandé',
        misÀJourLe: DateTime.now().formatter(),
        régionProjet: [],
      };

      const recoursToUpsert: Omit<Recours.RecoursEntity, 'type'> = Option.isSome(recours)
        ? recours
        : recoursDefaultValue;

      switch (type) {
        case 'RecoursDemandé-V1':
          const projet = await CandidatureAdapter.récupérerCandidatureAdapter(identifiantProjet);

          if (Option.isNone(projet)) {
            getLogger().error(new Error(`Projet inconnu !`), { identifiantProjet, message: event });
          }

          await upsertProjection<Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
            ...recoursDefaultValue,
            nomProjet: Option.isSome(projet) ? projet.nom : 'Projet inconnu',
            appelOffre: Option.isSome(projet) ? projet.appelOffre : `N/A`,
            période: Option.isSome(projet) ? projet.période : `N/A`,
            famille: Option.isSome(projet) ? projet.famille : undefined,
            demandePièceJustificativeFormat:
              payload.pièceJustificative && payload.pièceJustificative.format,
            demandeDemandéLe: payload.demandéLe,
            demandeDemandéPar: payload.demandéPar,
            demandeRaison: payload.raison,
            statut: 'demandé',
            misÀJourLe: payload.demandéLe,
            régionProjet: Option.isSome(projet) ? [...projet.localité.région.split(' / ')] : [],
          });
          break;
        case 'RecoursAccordé-V1':
          await upsertProjection<Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
            ...recoursToUpsert,
            accordAccordéLe: payload.accordéLe,
            accordAccordéPar: payload.accordéPar,
            accordRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'accordé',
            misÀJourLe: payload.accordéLe,
          });
          break;
        case 'RecoursRejeté-V1':
          await upsertProjection<Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
            ...recoursToUpsert,
            rejetRejetéLe: payload.rejetéLe,
            rejetRejetéPar: payload.rejetéPar,
            rejetRéponseSignéeFormat: payload.réponseSignée.format,
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

  mediator.register('EXECUTE_RECOURS_PROJECTOR', handler);
};
