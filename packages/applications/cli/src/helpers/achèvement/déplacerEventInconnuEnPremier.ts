import type { DateTime } from '@potentiel-domain/common';
import type { IdentifiantProjet } from '@potentiel-domain/projet';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

type DéplacerEventInconnuEnPremierProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  version: number;
  createdAt: DateTime.RawType;
  date: DateTime.RawType;
};

export const déplacerEventInconnuEnPremier = async ({
  identifiantProjet,
  version,
  createdAt,
  date,
}: DéplacerEventInconnuEnPremierProps) => {
  const streamId = `achevement|${identifiantProjet}`;

  // Mise en version temporaire négative pour libérer la version 1
  await executeQuery(
    `
      UPDATE event_store.event_stream
      SET version = -1
      WHERE stream_id = $1
        AND type = 'DateAchèvementPrévisionnelCalculée-V1'
        AND payload->>'raison' = 'inconnue'
        AND version = $2
    `,
    streamId,
    version,
  );

  // Incrémentation de la version des events précédents uniquement
  await executeQuery(
    `
      UPDATE event_store.event_stream
      SET version = version + 1
      WHERE stream_id = $1
        AND version > 0
        AND version < $2
    `,
    streamId,
    version,
  );

  // Placement de l'event en version 1 avec le payload corrigé
  await executeQuery(
    `
      UPDATE event_store.event_stream
      SET
        version = 1,
        created_at = $2,
        payload = jsonb_set(jsonb_set(payload, '{raison}', $3::jsonb), '{date}', $4::jsonb)
      WHERE stream_id = $1
        AND version = -1
    `,
    streamId,
    createdAt,
    JSON.stringify('notification'),
    JSON.stringify(date),
  );
};
