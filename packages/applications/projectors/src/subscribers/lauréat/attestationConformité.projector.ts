import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Achèvement } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type SubscriptionEvent =
  | (Achèvement.AttestationConformité.AttestationConformitéEvent & Event)
  | RebuildTriggered;

export type Execute = Message<
  'System.Projector.Lauréat.Achèvement.AttestationConformité',
  SubscriptionEvent
>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;
    if (type === 'RebuildTriggered') {
      await removeProjection<Achèvement.AttestationConformité.AttestationConformitéEntity>(
        `attestation-conformite|${payload.id}`,
      );
    } else {
      const { identifiantProjet } = payload;

      const attestationConformité =
        await findProjection<Achèvement.AttestationConformité.AttestationConformitéEntity>(
          `attestation-conformite|${identifiantProjet}`,
        );

      const attestationConformitéDefaultValue: Omit<
        Achèvement.AttestationConformité.AttestationConformitéEntity,
        'type'
      > = {
        appelOffre: '',
        période: '',
        famille: undefined,
        nomProjet: '',
        régionProjet: '',
        attestation: { format: '' },
        dateTransmission: '',
        preuveTransmissionAuCocontractant: { format: '' },
        dateTransmissionAuCocontractant: '',
        dernièreMiseÀJour: { date: '', utilisateur: '' },
        identifiantProjet: '',
      };

      const attestationConformitéToUpsert: Omit<
        Achèvement.AttestationConformité.AttestationConformitéEntity,
        'type'
      > = Option.isSome(attestationConformité)
        ? attestationConformité
        : attestationConformitéDefaultValue;

      const getProjectData = async (identifiantProjet: IdentifiantProjet.RawType) => {
        const projet = await CandidatureAdapter.récupérerCandidatureAdapter(identifiantProjet);
        if (Option.isNone(projet)) {
          getLogger().error(new Error(`Projet inconnu !`), {
            identifiantProjet,
            message: event,
          });
        }
        return {
          nomProjet: Option.isSome(projet) ? projet.nom : 'Projet inconnu',
          appelOffre: Option.isSome(projet) ? projet.appelOffre : `N/A`,
          période: Option.isSome(projet) ? projet.période : `N/A`,
          famille: Option.isSome(projet) ? projet.famille : undefined,
          régionProjet: Option.isSome(projet) ? projet.localité.région : '',
        };
      };

      switch (type) {
        case 'AttestationConformitéTransmise-V1':
          const projet = await getProjectData(identifiantProjet);
          await upsertProjection<Achèvement.AttestationConformité.AttestationConformitéEntity>(
            `attestation-conformite|${identifiantProjet}`,
            {
              ...attestationConformitéToUpsert,
              identifiantProjet: payload.identifiantProjet,
              nomProjet: projet.nomProjet,
              appelOffre: projet.appelOffre,
              période: projet.période,
              famille: projet.famille,
              régionProjet: projet.régionProjet,
              attestation: { format: payload.attestation.format },
              dateTransmission: payload.date,
              preuveTransmissionAuCocontractant: {
                format: payload.preuveTransmissionAuCocontractant.format,
              },
              dateTransmissionAuCocontractant: payload.dateTransmissionAuCocontractant,
              dernièreMiseÀJour: { date: payload.date, utilisateur: payload.utilisateur },
            },
          );
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat.Achèvement.AttestationConformité', handler);
};
