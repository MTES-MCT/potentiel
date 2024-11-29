import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { executeSelect } from '@potentiel-libraries/pg-helpers';

export async function waitForEvents() {
  await new Promise((r) => setTimeout(r, 50));
  // wait for sagas, notifications and projections to finish
  await waitForExpect(async () => {
    const [{ count }] = await executeSelect<{ count: number }>(
      `select count(*) as count from event_store.pending_acknowledgement where error is null`,
    );
    expect(count).to.eq(0, "pending_acknowledgement n'est pas vide");
  });
}
