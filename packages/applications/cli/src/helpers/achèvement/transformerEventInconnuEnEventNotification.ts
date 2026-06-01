import type { DateTime } from '@potentiel-domain/common';
import type { IdentifiantProjet } from '@potentiel-domain/projet';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

type TransformerEventInconnuEnEventNotificationProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  createdAt: DateTime.RawType;
  date: DateTime.RawType;
};

export const transformerEventInconnuEnEventNotification = async ({
  identifiantProjet,
  createdAt,
  date,
}: TransformerEventInconnuEnEventNotificationProps) => {
  await executeQuery(
    `
      UPDATE event_store.event_stream
      SET
        created_at = $2,
        payload = jsonb_set(jsonb_set(payload, '{raison}', $3::jsonb), '{date}', $4::jsonb)
      WHERE
        stream_id = $1
        AND type = 'DateAchèvementPrévisionnelCalculée-V1'
        AND payload->>'raison' = 'inconnue'
        AND version = 1
    `,
    `achevement|${identifiantProjet}`,
    createdAt,
    JSON.stringify('notification'),
    JSON.stringify(date),
  );
};
