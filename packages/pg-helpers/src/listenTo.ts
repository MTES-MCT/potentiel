import EventEmitter from 'events';
import { Client } from 'pg';
import { getConnectionString } from './getConnectionString';

export const listenTo = (channel: string, eventEmitter: EventEmitter) => {
  const client = new Client(getConnectionString());
  client.connect((err) => {
    if (!err) {
      client.on('notification', (notification) => {
        eventEmitter.emit(notification.channel, notification.payload);
      });
      client.query(`LISTEN ${channel}`);
    }
  });

  return async () => {
    await client.query(`UNLISTEN ${channel}`);
    await client.end();
  };
};
