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
      await removeProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
        `depot-en-cours-garanties-financieres|${payload.id}`,
      );
    } else {
      const { identifiantProjet } = payload;

      const garantiesFinancières =
        await findProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
          `garanties-financieres|${identifiantProjet}`,
        );

      const dépôtEnCoursGarantiesFinancières =
        await findProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
          `depot-en-cours-garanties-financieres|${identifiantProjet}`,
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

      const dépôtEnCoursGarantiesFinancièresDefaultValue: Omit<
        GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity,
        'type'
      > = {
        identifiantProjet,
        nomProjet: '',
        appelOffre: '',
        période: '',
        famille: undefined,
        régionProjet: [],
        dépôt: {
          type: '',
          dateÉchéance: '',
          statut: '',
          dateConstitution: '',
          attestation: {
            format: '',
          },
          soumisLe: '',
          dernièreMiseÀJour: {
            date: '',
            par: '',
          },
        },
      };

      const dépôtEnCoursGarantiesFinancièresToUpsert: Omit<
        GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity,
        'type'
      > = isSome(dépôtEnCoursGarantiesFinancières)
        ? dépôtEnCoursGarantiesFinancières
        : dépôtEnCoursGarantiesFinancièresDefaultValue;

      const garantiesFinancièresToUpsert: Omit<
        GarantiesFinancières.GarantiesFinancièresEntity,
        'type'
      > = isSome(garantiesFinancières) ? garantiesFinancières : garantiesFinancièresDefaultValue;

      const getProjectData = async (identifiantProjet: IdentifiantProjet.RawType) => {
        const projet = await CandidatureAdapter.récupérerCandidatureAdapter(identifiantProjet);
        if (isNone(projet)) {
          getLogger().error(new Error(`Projet inconnu !`), {
            identifiantProjet,
            message: event,
          });
        }
        return {
          nomProjet: isSome(projet) ? projet.nom : 'Projet inconnu',
          appelOffre: isSome(projet) ? projet.appelOffre : `N/A`,
          période: isSome(projet) ? projet.période : `N/A`,
          famille: isSome(projet) ? projet.famille : undefined,
          régionProjet: isSome(projet) ? [...projet.localité.région.split(' / ')] : [],
        };
      };

      const projetPourGarantiesFinancièresSoumises = await getProjectData(identifiantProjet);

      switch (type) {
        case 'DépôtGarantiesFinancièresSoumis-V1':
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

          await upsertProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
            `depot-en-cours-garanties-financieres|${identifiantProjet}`,
            {
              ...projetPourGarantiesFinancièresSoumises,
              identifiantProjet,
              dépôt: {
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
            },
          );
          break;

        case 'DépôtGarantiesFinancièresEnCoursSupprimé-V1':
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              dépôts: garantiesFinancièresToUpsert.dépôts.filter(
                (dépôt) =>
                  !GarantiesFinancières.StatutDépôtGarantiesFinancières.convertirEnValueType(
                    dépôt.statut,
                  ).estÉgaleÀ(GarantiesFinancières.StatutDépôtGarantiesFinancières.enCours),
              ),
            },
          );

          await removeProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
            `depot-en-cours-garanties-financieres|${identifiantProjet}`,
          );
          break;

        case 'DépôtGarantiesFinancièresEnCoursValidé-V1':
          const dépôtValidé = garantiesFinancièresToUpsert.dépôts.find((dépôt) =>
            GarantiesFinancières.StatutDépôtGarantiesFinancières.convertirEnValueType(
              dépôt.statut,
            ).estÉgaleÀ(GarantiesFinancières.StatutDépôtGarantiesFinancières.enCours),
          );

          if (!dépôtValidé) {
            getLogger().error(
              new Error(
                `dépôt garanties financières en cours absent, impossible d'enregistrer les données des garanties financières validées`,
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
              actuelles: {
                type: dépôtValidé.type,
                ...(dépôtValidé.dateÉchéance && {
                  dateÉchéance: dépôtValidé.dateÉchéance,
                }),
                attestation: dépôtValidé.attestation,
                dateConstitution: dépôtValidé.dateConstitution,
                validéLe: payload.validéLe,
                soumisLe: dépôtValidé.soumisLe,
                dernièreMiseÀJour: {
                  date: payload.validéLe,
                  par: payload.validéPar,
                },
              },
              dépôts: garantiesFinancièresToUpsert.dépôts.filter(
                (dépôt) =>
                  !GarantiesFinancières.StatutDépôtGarantiesFinancières.convertirEnValueType(
                    dépôt.statut,
                  ).estÉgaleÀ(GarantiesFinancières.StatutDépôtGarantiesFinancières.enCours),
              ),
            },
          );

          await removeProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
            `depot-en-cours-garanties-financieres|${identifiantProjet}`,
          );
          break;

        case 'DépôtGarantiesFinancièresEnCoursModifié-V1':
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              dépôts: [
                ...garantiesFinancièresToUpsert.dépôts.filter(
                  (dépôt) =>
                    !GarantiesFinancières.StatutDépôtGarantiesFinancières.convertirEnValueType(
                      dépôt.statut,
                    ).estÉgaleÀ(GarantiesFinancières.StatutDépôtGarantiesFinancières.enCours),
                ),
                {
                  type: payload.type,
                  dateÉchéance: payload.dateÉchéance,
                  attestation: payload.attestation,
                  dateConstitution: payload.dateConstitution,
                  soumisLe: payload.modifiéLe,
                  statut: GarantiesFinancières.StatutDépôtGarantiesFinancières.enCours.statut,
                  dernièreMiseÀJour: {
                    date: payload.modifiéLe,
                    par: payload.modifiéPar,
                  },
                },
              ],
            },
          );
          await upsertProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
            `depot-en-cours-garanties-financieres|${identifiantProjet}`,
            {
              ...projetPourGarantiesFinancièresSoumises,
              identifiantProjet,
              dépôt: {
                ...dépôtEnCoursGarantiesFinancièresToUpsert.dépôt,
                type: payload.type,
                dateConstitution: payload.dateConstitution,
                attestation: payload.attestation,
                dateÉchéance: payload.dateÉchéance,
                dernièreMiseÀJour: {
                  date: payload.modifiéLe,
                  par: payload.modifiéPar,
                },
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
              actuelles: {
                type: payload.type,
                dateÉchéance: payload.dateÉchéance,
                typeImportéLe: payload.importéLe,
                dernièreMiseÀJour: {
                  date: payload.importéLe,
                  par: payload.importéPar,
                },
              },
            },
          );
          break;

        case 'GarantiesFinancièresModifiées-V1':
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              actuelles: {
                ...garantiesFinancièresToUpsert.actuelles,
                type: payload.type,
                dateÉchéance: payload.dateÉchéance,
                dateConstitution: payload.dateConstitution,
                attestation: payload.attestation,
                dernièreMiseÀJour: {
                  date: payload.modifiéLe,
                  par: payload.modifiéPar,
                },
              },
            },
          );
          break;

        case 'AttestationGarantiesFinancièresEnregistrée-V1':
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              actuelles: {
                type:
                  garantiesFinancièresToUpsert.actuelles?.type ??
                  GarantiesFinancières.TypeGarantiesFinancières.inconnu.type,
                ...garantiesFinancièresToUpsert.actuelles,
                dateConstitution: payload.dateConstitution,
                attestation: payload.attestation,
                dernièreMiseÀJour: {
                  par: payload.enregistréPar,
                  date: payload.enregistréLe,
                },
              },
            },
          );
          break;

        case 'GarantiesFinancièresEnregistrées-V1':
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              actuelles: {
                type: payload.type,
                dateÉchéance: payload.dateÉchéance,
                dateConstitution: payload.dateConstitution,
                attestation: payload.attestation,
                dernièreMiseÀJour: {
                  date: payload.enregistréLe,
                  par: payload.enregistréPar,
                },
              },
            },
          );
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat.GarantiesFinancières', handler);
};
