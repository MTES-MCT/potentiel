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

export type SubscriptionEvent =
  | (GarantiesFinancières.GarantiesFinancièresEvent & Event)
  | RebuildTriggered;

export type Execute = Message<
  'System.Projector.Lauréat.MainLevéeGarantiesFinancières',
  SubscriptionEvent
>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;
    if (type === 'RebuildTriggered') {
      await removeProjection<GarantiesFinancières.MainLevéeGarantiesFinancièresEntity>(
        `main-levee-garanties-financieres|${payload.id}`,
      );
    } else {
      const { identifiantProjet } = payload;

      const mainLevéeGarantiesFinancières =
        await findProjection<GarantiesFinancières.MainLevéeGarantiesFinancièresEntity>(
          `main-levee-garanties-financieres|${identifiantProjet}`,
        );

      const mainLevéeGarantiesFinancièresDefaultValue: Omit<
        GarantiesFinancières.MainLevéeGarantiesFinancièresEntity,
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

      const mainLevéeGarantiesFinancièresToUpsert: Omit<
        GarantiesFinancières.MainLevéeGarantiesFinancièresEntity,
        'type'
      > = Option.isSome(mainLevéeGarantiesFinancières)
        ? mainLevéeGarantiesFinancières
        : mainLevéeGarantiesFinancièresDefaultValue;

      const getProjectData = async (identifiantProjet: IdentifiantProjet.RawType) => {
        const projet = await CandidatureAdapter.récupérerCandidatureAdapter(identifiantProjet);
        if (Option.isNone(projet)) {
          getLogger().error(new Error(`Projet inconnu !`), {
            identifiantProjet,
            message: event,
          });

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

      switch (type) {
        case 'MainLevéeGarantiesFinancièresDemandée-V1':
          const projet = await getProjectData(identifiantProjet);

          await upsertProjection<GarantiesFinancières.MainLevéeGarantiesFinancièresEntity>(
            `main-levee-garanties-financieres|${identifiantProjet}`,
            {
              ...mainLevéeGarantiesFinancièresToUpsert,
              ...projet,
              identifiantProjet: payload.identifiantProjet,
              demande: { demandéeLe: payload.demandéLe, demandéePar: payload.demandéPar },
              motif: payload.motif,
              statut: GarantiesFinancières.StatutMainLevéeGarantiesFinancières.demandé.statut,
              dernièreMiseÀJour: {
                date: payload.demandéLe,
                par: payload.demandéPar,
              },
            },
          );
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat.MainLevéeGarantiesFinancières', handler);
};
