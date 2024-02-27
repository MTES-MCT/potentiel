import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone, isSome } from '@potentiel/monads';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';

import { removeProjection } from '../utils/removeProjection';
import { upsertProjection } from '../utils/upsertProjection';
import { getLogger } from '@potentiel/monitoring';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

export type SubscriptionEvent =
  | (GarantiesFinancières.GarantiesFinancièresEvent & Event)
  | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.GarantiesFinancières', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;
    if (type === 'RebuildTriggered') {
      await removeProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
        `garanties-financieres|${payload.id}`,
      );
    } else {
      const { identifiantProjet } = payload;

      const garantiesFinancières =
        await findProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
          `garanties-financieres|${identifiantProjet}`,
        );

      const garantiesFinancièresDefaultValue: Omit<
        GarantiesFinancières.GarantiesFinancièresEntity,
        'type'
      > = {
        identifiantProjet,
        nomProjet: '',
        appelOffre: '',
        période: '',
        famille: undefined,
        régionProjet: [],
        misÀJourLe: DateTime.now().formatter(),
        statut: '',
      };

      const garantiesFinancièresToUpsert: Omit<
        GarantiesFinancières.GarantiesFinancièresEntity,
        'type'
      > = isSome(garantiesFinancières) ? garantiesFinancières : garantiesFinancièresDefaultValue;

      const getProjectData = async (identifiantProjet: IdentifiantProjet.RawType) => {
        const projet = await CandidatureAdapter.récupérerCandidatureAdapter(identifiantProjet);
        if (isNone(projet)) {
          getLogger().error(new Error(`Projet inconnu !`), { identifiantProjet, message: event });
        }
        return {
          nomProjet: isSome(projet) ? projet.nom : 'Projet inconnu',
          appelOffre: isSome(projet) ? projet.appelOffre : `N/A`,
          période: isSome(projet) ? projet.période : `N/A`,
          famille: isSome(projet) ? projet.famille : undefined,
          régionProjet: isSome(projet) ? [...projet.localité.région.split(' / ')] : [],
        };
      };

      const statutGarantiesFinancièresEnAttente: GarantiesFinancières.StatutGarantiesFinancières.RawType =
        'en-attente';
      const statutGarantiesFinancièresÀTraiter: GarantiesFinancières.StatutGarantiesFinancières.RawType =
        'à-traiter';
      const statutGarantiesFinancièresValidées: GarantiesFinancières.StatutGarantiesFinancières.RawType =
        'validé';

      switch (type) {
        case 'GarantiesFinancièresDemandées-V1':
          const projet = await getProjectData(identifiantProjet);
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              ...projet,
              misÀJourLe: payload.demandéLe,
              statut: statutGarantiesFinancièresEnAttente,
              enAttente: {
                dateLimiteSoumission: payload.dateLimiteSoumission,
                demandéLe: payload.demandéLe,
              },
            },
          );
          break;

        case 'GarantiesFinancièresSoumises-V1':
          const projetPourGarantiesFinancièresSoumises = await getProjectData(identifiantProjet);
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              ...projetPourGarantiesFinancièresSoumises,
              misÀJourLe: payload.soumisLe,
              statut: statutGarantiesFinancièresÀTraiter,
              àTraiter: {
                type: payload.type,
                dateÉchéance: payload.dateÉchéance,
                dateConstitution: payload.dateConstitution,
                attestation: payload.attestation,
                soumisLe: payload.soumisLe,
              },
            },
          );
          break;

        case 'GarantiesFinancièresÀTraiterSupprimées-V1':
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              misÀJourLe: payload.suppriméLe,
              statut: garantiesFinancièresToUpsert.enAttente
                ? statutGarantiesFinancièresEnAttente
                : statutGarantiesFinancièresValidées,
              àTraiter: undefined,
            },
          );
          break;

        case 'GarantiesFinancièresValidées-V1':
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              misÀJourLe: payload.validéLe,
              statut: statutGarantiesFinancièresValidées,
              validées: {
                type: garantiesFinancièresToUpsert.àTraiter!.type,
                ...(garantiesFinancièresToUpsert.àTraiter!.dateÉchéance && {
                  dateÉchéance: garantiesFinancièresToUpsert.àTraiter!.dateÉchéance,
                }),
                attestation: garantiesFinancièresToUpsert.àTraiter!.attestation,
                dateConstitution: garantiesFinancièresToUpsert.àTraiter!.dateConstitution,
                validéLe: payload.validéLe,
              },
              àTraiter: undefined,
              enAttente: undefined,
            },
          );
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat.GarantiesFinancières', handler);
};
