import { DomainEvent } from '../../core-domain/src/domainEvent';
import { executeSelect } from './helpers/executeSelect';

type Event = DomainEvent & { streamId: string };

export const loadFromStreamFactory =
  () =>
  async (streamId: string): Promise<ReadonlyArray<DomainEvent>> => {
    const result = await executeSelect<Event>(
      `SELECT "streamId", "createdAt", "type", "payload" FROM "EVENT_STREAM" where "streamId" = $1`,
      streamId,
    );

    return result.map(({ createdAt, type, payload }) => ({ createdAt, type, payload }));
  };
