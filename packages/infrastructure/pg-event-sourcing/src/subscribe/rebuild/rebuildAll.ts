import { getLogger } from '@potentiel-libraries/monitoring';

import { Event } from '../../event';
import { loadStreamList } from '../../load/loadStreamList';
import { Subscriber } from '../subscriber/subscriber';

import { rebuild } from './rebuild';
import { RebuildAllTriggered } from './rebuildAllTriggered.event';

export const rebuildAll = async <TEvent extends Event = Event>(
  rebuildAllTriggered: RebuildAllTriggered,
  subscriber: Subscriber<TEvent>,
) => {
  const streams = await loadStreamList({
    category: rebuildAllTriggered.payload.category,
    eventTypes:
      subscriber.eventType === 'all'
        ? undefined
        : Array.isArray(subscriber.eventType)
          ? subscriber.eventType
          : [subscriber.eventType],
  });

  let progress = 0;
  let errors = 0;
  const logger = getLogger(`rebuildAll - ${subscriber.streamCategory} - ${subscriber.name}`);

  const interval = setInterval(() => {
    logger.info(`Rebuild progress: ${progress}/${streams.length}`);
  }, 1000);

  for (const stream of streams) {
    try {
      await rebuild(
        {
          type: 'RebuildTriggered',
          created_at: rebuildAllTriggered.created_at,
          stream_id: stream.stream_id,
          version: rebuildAllTriggered.version,
          payload: {
            category: rebuildAllTriggered.payload.category,
            id: stream.stream_id.split('|')[1],
          },
        },
        subscriber,
      );
    } catch (e) {
      logger.error('Error rebuilding stream ', { streamId: stream.stream_id, error: e });
      errors++;
    }
    progress++;
  }
  if (errors > 0) {
    logger.error('Rebuild completed with errors: ' + errors + ' errors encountered.');
  } else {
    logger.info(`Rebuild completed successfully. ${progress}/${streams.length}`);
  }
  clearInterval(interval);
};
