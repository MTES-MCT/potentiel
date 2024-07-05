import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';

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
      await removeProjection<GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity>(
        `projet-avec-garanties-financieres-en-attente|${payload.id}`,
      );
    } else {
      const { identifiantProjet } = payload;

      const garantiesFinancières =
        await findProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
          `garanties-financieres|${identifiantProjet}`,
        );

      const projetAvecGarantiesFinancièresEnAttente =
        await findProjection<GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity>(
          `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
        );

      const garantiesFinancièresDefaultValue: Omit<
        GarantiesFinancières.GarantiesFinancièresEntity,
        'type'
      > = {
        identifiantProjet,
        projet: {
          nomProjet: '',
          appelOffre: '',
          période: '',
          famille: '',
          régionProjet: '',
        },

        typeGF: 'type-inconnu',
        dépôtEnCours: { type: 'aucun' },
        mainlevée: { statut: 'aucun' },
        miseÀJour: { dernièreMiseÀJourLe: '', dernièreMiseÀJourPar: '' },
      };

      const projetAvecGarantiesFinancièresEnAttenteDefaultValue: Omit<
        GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity,
        'type'
      > = {
        identifiantProjet,
        nomProjet: '',
        appelOffre: '',
        période: '',
        famille: '',
        régionProjet: '',
        motif: '',
        dernièreMiseÀJour: {
          date: '',
        },
        dateLimiteSoumission: '',
      };

      const garantiesFinancièresToUpsert: Omit<
        GarantiesFinancières.GarantiesFinancièresEntity,
        'type'
      > = Option.isSome(garantiesFinancières)
        ? garantiesFinancières
        : garantiesFinancièresDefaultValue;

      const projetAvecGarantiesFinancièresEnAttenteToUpsert: Omit<
        GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity,
        'type'
      > = Option.isSome(projetAvecGarantiesFinancièresEnAttente)
        ? projetAvecGarantiesFinancièresEnAttente
        : projetAvecGarantiesFinancièresEnAttenteDefaultValue;

      const getProjectData = async (identifiantProjet: IdentifiantProjet.RawType) => {
        const projet = await CandidatureAdapter.récupérerCandidatureAdapter(identifiantProjet);
        if (Option.isNone(projet)) {
          getLogger().warn(`Projet inconnu !`),
            {
              identifiantProjet,
              message: event,
            };
          return {
            nomProjet: 'Projet inconnu',
            appelOffre: `N/A`,
            période: `N/A`,
            famille: '',
            régionProjet: '',
          };
        }
        return {
          nomProjet: projet.nom,
          appelOffre: projet.appelOffre,
          période: projet.période,
          famille: projet.famille,
          régionProjet: projet.localité.région,
        };
      };

      let détailProjet:
        | {
            nomProjet: string;
            régionProjet: string;
            appelOffre: string;
            période: string;
            famille: string;
          }
        | undefined = undefined;

      switch (type) {
        case 'GarantiesFinancièresDemandées-V1':
          détailProjet = await getProjectData(identifiantProjet);

          await upsertProjection<GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity>(
            `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
            {
              ...projetAvecGarantiesFinancièresEnAttenteToUpsert,
              ...détailProjet,
              identifiantProjet: payload.identifiantProjet,
              motif: payload.motif ?? '',
              dateLimiteSoumission: payload.dateLimiteSoumission,
              dernièreMiseÀJour: {
                date: payload.demandéLe,
              },
            },
          );
          break;

        case 'TypeGarantiesFinancièresImporté-V1':
          détailProjet = await getProjectData(identifiantProjet);

          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              projet: {
                ...détailProjet,
              },
              identifiantProjet,
              ...(payload.type === 'avec-date-échéance'
                ? { typeGF: 'avec-date-échéance' as const, dateÉchéance: payload.dateÉchéance }
                : { typeGF: payload.type }),
              miseÀJour: {
                dernièreMiseÀJourLe: payload.importéLe,
                dernièreMiseÀJourPar: '',
              },
            },
          );
          break;

        case 'GarantiesFinancièresModifiées-V1':
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              ...(payload.type === 'avec-date-échéance'
                ? { typeGF: 'avec-date-échéance' as const, dateÉchéance: payload.dateÉchéance }
                : { typeGF: payload.type }),
              dateConstitution: payload.dateConstitution,
              attestation: payload.attestation,
              miseÀJour: {
                dernièreMiseÀJourLe: payload.modifiéLe,
                dernièreMiseÀJourPar: payload.modifiéPar,
              },
            },
          );
          break;

        case 'AttestationGarantiesFinancièresEnregistrée-V1':
          détailProjet = await getProjectData(identifiantProjet);
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              projet: {
                ...détailProjet,
              },
              dateConstitution: payload.dateConstitution,
              attestation: payload.attestation,
              miseÀJour: {
                dernièreMiseÀJourLe: payload.enregistréPar,
                dernièreMiseÀJourPar: payload.enregistréLe,
              },
            },
          );
          break;

        case 'GarantiesFinancièresEnregistrées-V1':
          détailProjet = await getProjectData(identifiantProjet);
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              projet: {
                ...détailProjet,
              },
              ...(payload.type === 'avec-date-échéance'
                ? { typeGF: 'avec-date-échéance' as const, dateÉchéance: payload.dateÉchéance }
                : { typeGF: payload.type }),
              dateConstitution: payload.dateConstitution,
              attestation: payload.attestation,
              miseÀJour: {
                dernièreMiseÀJourLe: payload.enregistréPar,
                dernièreMiseÀJourPar: payload.enregistréLe,
              },
            },
          );

          await removeProjection<GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity>(
            `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
          );
          break;

        case 'HistoriqueGarantiesFinancièresEffacé-V1':
          await removeProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
          );
          break;

        case 'DépôtGarantiesFinancièresSoumis-V1':
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              dépôtEnCours: {
                ...(payload.type === 'avec-date-échéance'
                  ? {
                      type: 'avec-date-échéance' as const,
                      dateÉchéance: payload.dateÉchéance ?? 'pas-de-date-échéance',
                    }
                  : { type: payload.type }),

                dateConstitution: payload.dateConstitution,
                attestation: payload.attestation,
                soumisLe: payload.soumisLe,
                miseÀJour: {
                  dernièreMiseÀJourLe: payload.soumisLe,
                  dernièreMiseÀJourPar: payload.soumisPar,
                },
              },
            },
          );

          await removeProjection<GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity>(
            `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
          );
          break;

        case 'DépôtGarantiesFinancièresEnCoursSupprimé-V1':
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              dépôtEnCours: {
                type: 'aucun',
              },
            },
          );
          break;

        case 'DépôtGarantiesFinancièresEnCoursValidé-V1':
          if (garantiesFinancièresToUpsert.dépôtEnCours.type === 'aucun') {
            return;
          }

          const dépôtValidé = garantiesFinancièresToUpsert.dépôtEnCours;

          const getTypeAndDateGf = () => {
            if (dépôtValidé.type === 'avec-date-échéance') {
              return {
                type: 'avec-date-échéance',
                dateÉchéance: dépôtValidé.dateÉchéance ?? 'pas-de-date-échéance',
              };
            }
            return {
              type: dépôtValidé.type,
            };
          };

          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              dépôtEnCours: {
                type: 'aucun',
              },
              ...getTypeAndDateGf(),
              dateConstitution: dépôtValidé.dateConstitution,
              attestation: dépôtValidé.attestation,
              validéLe: payload.validéLe,
              soumisLe: dépôtValidé.soumisLe,
              miseÀJour: {
                dernièreMiseÀJourLe: payload.validéLe,
                dernièreMiseÀJourPar: payload.validéPar,
              },
            },
          );
          break;

        case 'DépôtGarantiesFinancièresEnCoursModifié-V1':
          if (garantiesFinancièresToUpsert.dépôtEnCours.type === 'aucun') {
            return;
          }

          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              dépôtEnCours: {
                ...garantiesFinancièresToUpsert.dépôtEnCours,
                ...(payload.type === 'avec-date-échéance'
                  ? { typeGF: 'avec-date-échéance' as const, dateÉchéance: payload.dateÉchéance }
                  : { typeGF: payload.type }),
                dateConstitution: payload.dateConstitution,
                attestation: payload.attestation,
                miseÀJour: {
                  dernièreMiseÀJourLe: payload.modifiéLe,
                  dernièreMiseÀJourPar: payload.modifiéPar,
                },
              },
            },
          );
          break;

        case 'MainlevéeGarantiesFinancièresDemandée-V1':
          détailProjet = await getProjectData(identifiantProjet);

          await upsertProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
            `mainlevee-garanties-financieres|${identifiantProjet}`,
            {
              ...mainlevéeGarantiesFinancièresToUpsert,
              ...détailProjet,
              identifiantProjet: payload.identifiantProjet,
              demande: { demandéeLe: payload.demandéLe, demandéePar: payload.demandéPar },
              motif: payload.motif,
              statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.demandé.statut,
              dernièreMiseÀJour: {
                date: payload.demandéLe,
                par: payload.demandéPar,
              },
            },
          );
          break;

        case 'DemandeMainlevéeGarantiesFinancièresAnnulée-V1':
          await removeProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
            `mainlevee-garanties-financieres|${identifiantProjet}`,
          );
          break;

        case 'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1':
          await upsertProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
            `mainlevee-garanties-financieres|${identifiantProjet}`,
            {
              ...mainlevéeGarantiesFinancièresToUpsert,
              statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.enInstruction.statut,
              instruction: { démarréeLe: payload.démarréLe, démarréePar: payload.démarréPar },
              dernièreMiseÀJour: {
                date: payload.démarréLe,
                par: payload.démarréPar,
              },
            },
          );
          break;

        case 'DemandeMainlevéeGarantiesFinancièresAccordée-V1':
          await upsertProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
            `mainlevee-garanties-financieres|${identifiantProjet}`,
            {
              ...mainlevéeGarantiesFinancièresToUpsert,
              statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.accordé.statut,
              accord: {
                accordéeLe: payload.accordéLe,
                accordéePar: payload.accordéPar,
                courrierAccord: { format: payload.réponseSignée.format },
              },
              dernièreMiseÀJour: {
                date: payload.accordéLe,
                par: payload.accordéPar,
              },
            },
          );
          break;

        case 'DemandeMainlevéeGarantiesFinancièresRejetée-V1':
          détailProjet = await getProjectData(identifiantProjet);

          await upsertProjection<GarantiesFinancières.HistoriqueMainlevéeRejetéeGarantiesFinancièresEntity>(
            `historique-mainlevee-rejetee-garanties-financieres|${identifiantProjet}`,

            {
              ...historiqueMainlevéeRejetéeGarantiesFinancièresToUpsert,
              ...détailProjet,
              identifiantProjet: payload.identifiantProjet,
              historique: [
                ...historiqueMainlevéeRejetéeGarantiesFinancièresToUpsert.historique,
                {
                  demande: mainlevéeGarantiesFinancièresToUpsert.demande,
                  motif: mainlevéeGarantiesFinancièresToUpsert.motif,
                  rejet: {
                    rejetéLe: payload.rejetéLe,
                    rejetéPar: payload.rejetéPar,
                    courrierRejet: { format: payload.réponseSignée.format },
                  },
                },
              ],
            },
          );

          await removeProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
            `mainlevee-garanties-financieres|${identifiantProjet}`,
          );
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat.GarantiesFinancières', handler);
};
