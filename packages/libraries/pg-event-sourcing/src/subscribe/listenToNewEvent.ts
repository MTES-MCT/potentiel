import { EventEmitter } from 'events';
import { getConnectionString } from '@potentiel/pg-helpers';
import { Client } from 'pg';

export const listenToNewEvent = (eventEmitter: EventEmitter, name: string) => {
  const client = new Client(getConnectionString());
  client.connect((err) => {
    if (!err) {
      client.on('notification', (notification) => {
        eventEmitter.emit(notification.channel, notification.payload);
      });
      client.query(`listen ${name}`);
    } else {
      console.error(err);
    }
  });

  return async () => {
    await client.query(`unlisten ${name}`);
  };
};
