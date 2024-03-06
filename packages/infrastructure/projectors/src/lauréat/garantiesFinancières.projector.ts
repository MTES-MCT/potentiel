import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone, isSome } from '@potentiel/monads';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';

import { removeProjection } from '../utils/removeProjection';
import { upsertProjection } from '../utils/upsertProjection';
import { getLogger } from '@potentiel/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';

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
        actuelles: undefined,
        dépôts: [],
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

      switch (type) {
        case 'DépôtGarantiesFinancièresSoumis-V1':
          const projetPourGarantiesFinancièresSoumises = await getProjectData(identifiantProjet);
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              ...projetPourGarantiesFinancièresSoumises,
              dépôts: [
                ...garantiesFinancièresToUpsert.dépôts,
                {
                  type: payload.type,
                  dateÉchéance: payload.dateÉchéance,
                  statut: GarantiesFinancières.StatutDépôtGarantiesFinancières.enCours.statut,
                  dateConstitution: payload.dateConstitution,
                  attestation: payload.attestation,
                  soumisLe: payload.soumisLe,
                  dernièreMiseÀJour: {
                    date: payload.soumisLe,
                    par: payload.soumisPar,
                  },
                },
              ],
            },
          );
          break;

        case 'DépôtGarantiesFinancièresEnCoursSupprimé-V1':
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              misÀJourLe: payload.suppriméLe,
              statut: garantiesFinancièresToUpsert.enAttente
                ? GarantiesFinancières.StatutGarantiesFinancières.enAttente.statut
                : GarantiesFinancières.StatutGarantiesFinancières.validé.statut,
              àTraiter: undefined,
            },
          );
          break;

        case 'DépôtGarantiesFinancièresEnCoursValidé-V1':
          if (!garantiesFinancièresToUpsert.àTraiter) {
            getLogger().error(
              new Error(
                `garanties financières à traiter absentes, impossible d'enregistrer les données des garanties financières validées`,
              ),
              {
                identifiantProjet,
                message: event,
              },
            );
            return;
          }
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              misÀJourLe: payload.validéLe,
              statut: GarantiesFinancières.StatutGarantiesFinancières.validé.statut,
              validées: {
                type: garantiesFinancièresToUpsert.àTraiter.type,
                ...(garantiesFinancièresToUpsert.àTraiter.dateÉchéance && {
                  dateÉchéance: garantiesFinancièresToUpsert.àTraiter.dateÉchéance,
                }),
                attestation: garantiesFinancièresToUpsert.àTraiter.attestation,
                dateConstitution: garantiesFinancièresToUpsert.àTraiter.dateConstitution,
                validéLe: payload.validéLe,
                soumisLe: garantiesFinancièresToUpsert.àTraiter.soumisLe,
              },
              àTraiter: undefined,
              enAttente: undefined,
            },
          );
          break;

        case 'DépôtGarantiesFinancièresEnCoursModifié-V1':
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              misÀJourLe: payload.modifiéLe,
              statut: GarantiesFinancières.StatutGarantiesFinancières.àTraiter.statut,
              àTraiter: {
                type: payload.type,
                dateÉchéance: payload.dateÉchéance,
                dateConstitution: payload.dateConstitution,
                attestation: payload.attestation,
                soumisLe: payload.modifiéLe,
              },
            },
          );
          break;

        case 'TypeGarantiesFinancièresImporté-V1':
          const projetPourTypeGarantiesFinancièresImporté = await getProjectData(identifiantProjet);
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              ...projetPourTypeGarantiesFinancièresImporté,
              misÀJourLe: payload.importéLe,
              statut: GarantiesFinancières.StatutGarantiesFinancières.validé.statut,
              validées: {
                type: payload.type,
                dateÉchéance: payload.dateÉchéance,
                importéLe: payload.importéLe,
              },
            },
          );
          break;

        case 'GarantiesFinancièresModifiées-V1':
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              misÀJourLe: payload.modifiéLe,
              validées: {
                ...garantiesFinancièresToUpsert.validées,
                type: payload.type,
                dateÉchéance: payload.dateÉchéance,
                dateConstitution: payload.dateConstitution,
                attestation: payload.attestation,
              },
            },
          );
          break;

        case 'AttestationGarantiesFinancièresEnregistrée-V1':
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              misÀJourLe: payload.enregistréLe,
              validées: {
                ...garantiesFinancièresToUpsert.validées,
                type: garantiesFinancièresToUpsert.validées?.type || 'type-inconnu',
                dateConstitution: payload.dateConstitution,
                attestation: payload.attestation,
              },
            },
          );
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat.GarantiesFinancières', handler);
};
