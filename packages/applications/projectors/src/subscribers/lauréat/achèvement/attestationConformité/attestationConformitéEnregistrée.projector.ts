import type { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const attestationConformitéEnregistréeProjector = async ({
  type,
  payload,
}:
  | Lauréat.Achèvement.AttestationConformitéEnregistréeEventV1
  | Lauréat.Achèvement.AttestationConformitéEnregistréeEvent) => {
  await updateOneProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${payload.identifiantProjet}`,
    {
      réel: {
        dernièreMiseÀJour: { date: payload.enregistréeLe, utilisateur: payload.enregistréePar },
        attestationConformité: {
          format: payload.attestationConformité.format,
          transmiseLe: payload.enregistréeLe,
        },
        ...(type === 'AttestationConformitéEnregistrée-V2' && {
          rapportAssocié: {
            format: payload.rapportAssocié.format,
            transmisLe: payload.enregistréeLe,
          },
        }),
      },
    },
  );
};
