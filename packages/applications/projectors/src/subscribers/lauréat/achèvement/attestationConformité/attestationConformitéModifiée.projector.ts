import type { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const attestationConformitéModifiéeProjector = async (
  event:
    | Lauréat.Achèvement.AttestationConformitéModifiéeEventV1
    | Lauréat.Achèvement.AttestationConformitéModifiéeEvent,
) => {
  await updateOneProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${event.payload.identifiantProjet}`,
    {
      réel: {
        attestationConformité: {
          format: event.payload.attestation.format,
          transmiseLe: event.payload.modifiéeLe,
        },
        ...(event.type !== 'AttestationConformitéModifiée-V1' && {
          rapportAssocié: {
            format: event.payload.rapportAssocié.format,
            transmisLe: event.payload.modifiéeLe,
          },
        }),
        dernièreMiseÀJour: {
          date: event.payload.modifiéeLe,
          utilisateur: event.payload.modifiéePar,
        },
      },
    },
  );
};
