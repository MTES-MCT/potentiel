import { describe, it, before, after } from 'node:test';

import { expect } from 'chai';

import { createTestServer, TestServer } from './testServer.js';
import { getAccessToken } from './getAccessToken.js';

describe('Raccordement API', () => {
  let server: TestServer;
  let token: string;
  let defaultHeaders: Record<string, string>;

  before(async () => {
    server = await createTestServer();
    token = await getAccessToken('enedis');
    defaultHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  });

  after(() => server.close());

  it('GET /reseaux/raccordements should return list of dossiers', async () => {
    const response = await fetch(`${server.rootUrl}/reseaux/raccordements`, {
      headers: defaultHeaders,
    });

    expect(response.status).to.equal(200);
    const data: { items: unknown[] } = await response.json();
    expect(data).to.have.property('items');
    expect(data.items).to.be.an('array');
  });

  it('POST /laureats/{id}/raccordements/{ref}/date-mise-en-service:transmettre should accept date', async () => {
    const identifiantProjet = 'PPE2 - Eolien#1##test-numero-cre-161';
    const reference = 'AAAAA';

    const response = await fetch(
      `${server.rootUrl}/laureats/${encodeURIComponent(identifiantProjet)}/raccordements/${reference}/date-mise-en-service:transmettre`,
      {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({
          dateMiseEnService: '2025-01-15',
        }),
      },
    );

    expect(response.status).to.equal(200);
  });
});
