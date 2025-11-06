import { bulkhead } from 'cockatiel';

import { getLogger } from '@potentiel-libraries/monitoring';

import { Event } from '../../event';
import { loadStreamList } from '../../load/loadStreamList';
import { Subscriber } from '../subscriber/subscriber';
import { loadFromStream } from '../../load/loadFromStream';

import { RebuildAllTriggered } from './rebuildAllTriggered.event';

export const rebuildAll = async <TEvent extends Event | RebuildAllTriggered = Event>(
  rebuildAllTriggered: RebuildAllTriggered,
  subscriber: Subscriber<TEvent>,
) => {
  const logger = getLogger(`rebuildAll - ${subscriber.streamCategory} - ${subscriber.name}`);
  const startTime = Date.now();
  let progress = 0;
  let errors = 0;

  const interval = setInterval(() => {
    logger.info(`Rebuild progress: ${progress}/${streams.length}`);
  }, 1000);

  const streams = await loadStreamList({
    category: rebuildAllTriggered.payload.category,
    eventTypes:
      subscriber.eventType === 'all'
        ? undefined
        : Array.isArray(subscriber.eventType)
          ? subscriber.eventType
          : [subscriber.eventType],
  });

  await subscriber.eventHandler(rebuildAllTriggered as TEvent);

  const rebuildStream = async (streamId: string) => {
    try {
      const events = await loadFromStream({
        streamId,
      });
      for (const event of events) {
        await subscriber.eventHandler(event as TEvent);
      }
    } catch (e) {
      logger.error('Error rebuilding stream ', { streamId, error: e });
      errors++;
    }
    progress++;
  };

  const maxConcurrency = +(process.env.REBUILD_CONCURRENCY ?? '5');
  const policy = bulkhead(maxConcurrency, Infinity);

  // Process all streams in parallel with controlled concurrency
  await Promise.all(streams.map(({ stream_id }) => policy.execute(() => rebuildStream(stream_id))));

  clearInterval(interval);

  if (errors > 0) {
    logger.error('Rebuild completed with errors: ' + errors + ' errors encountered.', {
      durationMs: Date.now() - startTime,
    });
  } else {
    logger.info(`Rebuild completed successfully. ${progress}/${streams.length}`, {
      durationMs: Date.now() - startTime,
    });
  }
};
