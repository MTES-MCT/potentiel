import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { executeSelect } from '@potentiel-libraries/pg-helpers';

const queryPendingAcknowledgements = `
select 
  pa.subscriber_name,
  es.stream_id,
  es.created_at,
  es.version,
  es.type,
  es.payload
from event_store.pending_acknowledgement pa 
inner join event_store.event_stream es on 
  pa.stream_id = es.stream_id and 
  pa.created_at = es.created_at and 
  pa.version = es.version`;

export async function waitForSagasNotificationsAndProjectionsToFinish() {
  await new Promise((r) => setTimeout(r, 50));
  // wait for sagas, notifications and projections to finish
  await waitForExpect(async () => {
    const pending = await executeSelect(queryPendingAcknowledgements);
    console.log(pending);
    expect(pending).to.deep.eq([], "pending_acknowledgement n'est pas vide");
  });
}
