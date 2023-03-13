import { DomainEvent } from '@potentiel/core-domain';
import { executeSelect } from './helpers/executeSelect';

export const loadFromStream = (streamId: string): Promise<ReadonlyArray<DomainEvent>> =>
  executeSelect<DomainEvent>(
    `SELECT "type", "payload" FROM "EVENT_STREAM" where "streamId" = $1 order by "createdAt", "version"`,
    streamId,
  );
