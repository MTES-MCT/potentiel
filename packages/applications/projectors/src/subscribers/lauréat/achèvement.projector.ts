import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Achèvement } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';

export type SubscriptionEvent = (Achèvement.AchèvementEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Achèvement', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;
    if (type === 'RebuildTriggered') {
      await removeProjection<Achèvement.AchèvementEntity>(`achevement|${payload.id}`);
    } else {
      const { identifiantProjet } = payload;

      const achèvement = await findProjection<Achèvement.AchèvementEntity>(
        `achevement|${identifiantProjet}`,
      );

      const achèvementDefaultValue: Omit<Achèvement.AchèvementEntity, 'type'> = {
        appelOffre: '',
        période: '',
        famille: undefined,
        nomProjet: '',
        régionProjet: '',
        attestationConformité: { format: '', date: '' },
        preuveTransmissionAuCocontractant: { format: '', date: '' },
        dernièreMiseÀJour: { date: '', utilisateur: '' },
        identifiantProjet: '',
      };

      const attestationConformitéToUpsert: Omit<Achèvement.AchèvementEntity, 'type'> =
        Option.isSome(achèvement) ? achèvement : achèvementDefaultValue;

      const getProjectData = async (identifiantProjet: IdentifiantProjet.RawType) => {
        const projet = await CandidatureAdapter.récupérerProjetAdapter(identifiantProjet);
        if (Option.isNone(projet)) {
          getLogger('System.Projector.Lauréat.Achèvement.getProjectData').warn(`Projet inconnu !`, {
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
        case 'AttestationConformitéTransmise-V1':
          const projet = await getProjectData(identifiantProjet);
          await upsertProjection<Achèvement.AchèvementEntity>(`achevement|${identifiantProjet}`, {
            ...attestationConformitéToUpsert,
            ...projet,
            identifiantProjet: payload.identifiantProjet,
            attestationConformité: { format: payload.attestation.format, date: payload.date },
            preuveTransmissionAuCocontractant: {
              format: payload.preuveTransmissionAuCocontractant.format,
              date: payload.dateTransmissionAuCocontractant,
            },
            dernièreMiseÀJour: { date: payload.date, utilisateur: payload.utilisateur },
          });
          break;

        case 'AttestationConformitéModifiée-V1':
          await upsertProjection<Achèvement.AchèvementEntity>(`achevement|${identifiantProjet}`, {
            ...attestationConformitéToUpsert,
            identifiantProjet: payload.identifiantProjet,
            attestationConformité: { format: payload.attestation.format, date: payload.date },
            preuveTransmissionAuCocontractant: {
              format: payload.preuveTransmissionAuCocontractant.format,
              date: payload.dateTransmissionAuCocontractant,
            },
            dernièreMiseÀJour: { date: payload.date, utilisateur: payload.utilisateur },
          });
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat.Achèvement', handler);
};
