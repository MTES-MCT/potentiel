import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { v4 as uuid } from 'uuid';

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
      await removeProjection<GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity>(
        `projet-avec-garanties-financieres-en-attente|${payload.id}`,
      );
      await removeProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
        `mainlevee-garanties-financieres|${payload.id}`,
      );
      await removeProjection<GarantiesFinancières.HistoriqueMainlevéeRejetéeGarantiesFinancièresEntity>(
        `historique-mainlevee-rejetee-garanties-financieres|${payload.id}`,
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

      const projetAvecGarantiesFinancièresEnAttente =
        await findProjection<GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity>(
          `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
        );

      const mainlevéeGarantiesFinancières =
        await findProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
          `mainlevee-garanties-financieres|${identifiantProjet}`,
        );

      const historiqueMainlevéeRejetéeGarantiesFinancières =
        await findProjection<GarantiesFinancières.HistoriqueMainlevéeRejetéeGarantiesFinancièresEntity>(
          `historique-mainlevee-rejetee-garanties-financieres|${identifiantProjet}`,
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
        régionProjet: '',
        garantiesFinancières: {
          type: '',
          dernièreMiseÀJour: { date: '', par: '' },
        },
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
        régionProjet: '',
        dépôt: {
          type: '',
          dateÉchéance: '',
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

      const mainlevéeGarantiesFinancièresDefaultValue: Omit<
        GarantiesFinancières.MainlevéeGarantiesFinancièresEntity,
        'type'
      > = {
        identifiantProjet,
        nomProjet: '',
        appelOffre: '',
        période: '',
        famille: undefined,
        régionProjet: '',
        demande: { demandéeLe: '', demandéePar: '' },
        motif: '',
        statut: '',
        dernièreMiseÀJour: { date: '', par: '' },
      };

      const historiqueMainlevéeRejetéeGarantiesFinancièresDefaultValue: Omit<
        GarantiesFinancières.HistoriqueMainlevéeRejetéeGarantiesFinancièresEntity,
        'type'
      > = {
        identifiantProjet,
        nomProjet: '',
        appelOffre: '',
        période: '',
        famille: undefined,
        régionProjet: '',
        historique: [],
      };

      const garantiesFinancièresToUpsert: Omit<
        GarantiesFinancières.GarantiesFinancièresEntity,
        'type'
      > = Option.isSome(garantiesFinancières)
        ? garantiesFinancières
        : garantiesFinancièresDefaultValue;

      const dépôtEnCoursGarantiesFinancièresToUpsert: Omit<
        GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity,
        'type'
      > = Option.isSome(dépôtEnCoursGarantiesFinancières)
        ? dépôtEnCoursGarantiesFinancières
        : dépôtEnCoursGarantiesFinancièresDefaultValue;

      const projetAvecGarantiesFinancièresEnAttenteToUpsert: Omit<
        GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity,
        'type'
      > = Option.isSome(projetAvecGarantiesFinancièresEnAttente)
        ? projetAvecGarantiesFinancièresEnAttente
        : projetAvecGarantiesFinancièresEnAttenteDefaultValue;

      const mainlevéeGarantiesFinancièresToUpsert: Omit<
        GarantiesFinancières.MainlevéeGarantiesFinancièresEntity,
        'type'
      > = Option.isSome(mainlevéeGarantiesFinancières)
        ? mainlevéeGarantiesFinancières
        : mainlevéeGarantiesFinancièresDefaultValue;

      const historiqueMainlevéeRejetéeGarantiesFinancièresToUpsert: Omit<
        GarantiesFinancières.HistoriqueMainlevéeRejetéeGarantiesFinancièresEntity,
        'type'
      > = Option.isSome(historiqueMainlevéeRejetéeGarantiesFinancières)
        ? historiqueMainlevéeRejetéeGarantiesFinancières
        : historiqueMainlevéeRejetéeGarantiesFinancièresDefaultValue;

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
            famille: undefined,
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
            famille?: string;
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

        case 'DépôtGarantiesFinancièresSoumis-V1':
          détailProjet = await getProjectData(identifiantProjet);

          await upsertProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
            `depot-en-cours-garanties-financieres|${identifiantProjet}`,
            {
              ...détailProjet,
              identifiantProjet,
              dépôt: {
                type: payload.type,
                dateÉchéance: payload.dateÉchéance,
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

          await removeProjection<GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity>(
            `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
          );
          break;

        case 'DépôtGarantiesFinancièresEnCoursSupprimé-V1':
          await removeProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
            `depot-en-cours-garanties-financieres|${identifiantProjet}`,
          );
          break;

        case 'DépôtGarantiesFinancièresEnCoursValidé-V1':
          détailProjet = await getProjectData(identifiantProjet);

          const dépôtValidé = dépôtEnCoursGarantiesFinancièresToUpsert.dépôt;

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
              ...détailProjet,
              garantiesFinancières: {
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
            },
          );

          await removeProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
            `depot-en-cours-garanties-financieres|${identifiantProjet}`,
          );
          break;

        case 'DépôtGarantiesFinancièresEnCoursModifié-V1':
          await upsertProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
            `depot-en-cours-garanties-financieres|${identifiantProjet}`,
            {
              ...dépôtEnCoursGarantiesFinancièresToUpsert,
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
          détailProjet = await getProjectData(identifiantProjet);
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              ...détailProjet,
              identifiantProjet,
              garantiesFinancières: {
                ...garantiesFinancièresToUpsert.garantiesFinancières,
                type: payload.type,
                dateÉchéance: payload.dateÉchéance,
                typeImportéLe: payload.importéLe,
                dernièreMiseÀJour: {
                  date: payload.importéLe,
                  par: '',
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
              garantiesFinancières: {
                ...garantiesFinancièresToUpsert.garantiesFinancières,
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
          détailProjet = await getProjectData(identifiantProjet);
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              ...détailProjet,
              garantiesFinancières: {
                ...garantiesFinancièresToUpsert.garantiesFinancières,
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
          détailProjet = await getProjectData(identifiantProjet);
          await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
            {
              ...garantiesFinancièresToUpsert,
              ...détailProjet,
              garantiesFinancières: {
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

          await removeProjection<GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity>(
            `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
          );
          break;

        case 'HistoriqueGarantiesFinancièresEffacé-V1':
          await removeProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres|${identifiantProjet}`,
          );

          await removeProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
            `depot-en-cours-garanties-financieres|${identifiantProjet}`,
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
                  id: uuid(),
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
