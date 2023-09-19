import { readFile } from 'fs/promises';
import { join } from 'path';
import { Sequelize } from 'sequelize';

export const runSqlScript = async (client: Sequelize) => {
  // Event Stream
  console.log('Create Event Stream');
  await executeScript(client, 'pg-event-sourcing', 'event-store/schema.sql');
  await executeScript(client, 'pg-event-sourcing', 'event-store/event-stream.sql');
  await executeScript(client, 'pg-event-sourcing', 'event-store/acknowledgement.sql');
  await executeScript(client, 'pg-event-sourcing', 'event-store/subscriber.sql');
  await executeScript(client, 'pg-event-sourcing', 'event-store/functions/notify-subscribers.sql');
  await executeScript(client, 'pg-event-sourcing', 'event-store/functions/rebuild.sql');

  if (process.env.APPLICATION_STAGE === 'test') {
    await client.query(`drop rule prevent_delete_on_event_stream on event_store.event_stream`);
  }

  // System Views
  console.log('Create System Views');
  await executeScript(client, 'pg-event-sourcing', 'system-views/schema.sql');
  await executeScript(client, 'pg-event-sourcing', 'system-views/stream-info.sql');
  await executeScript(client, 'pg-event-sourcing', 'system-views/stream-category.sql');

  // Domain Views
  console.log('Create Domain Views');
  await executeScript(client, 'pg-projections', 'domain-views/schema.sql');
  await executeScript(client, 'pg-projections', 'domain-views/projection.sql');
};

const executeScript = async (client: Sequelize, packageName: string, script: string) => {
  const sql = await readFile(
    join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'packages',
      'libraries',
      packageName,
      'sql',
      script,
    ),
    'utf-8',
  );
  await client.query(sql);
};
