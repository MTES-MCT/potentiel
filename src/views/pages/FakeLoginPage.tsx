import { Request } from 'express';
import React from 'react';
import { dataId } from '../../helpers/testId';
import routes from '@routes';
import { Button, ErrorBox, PageTemplate } from '@components';
import { hydrateOnClient } from '../helpers';

interface FakeLoginProps {
  request: Request;
}

export const FakeLogin = ({ request }: FakeLoginProps) => {
  const { error } = (request.query as any) || {};
  return (
    <PageTemplate user={request.user}>
      <main role="main">
        <section className="section section-grey" style={{ minHeight: 'calc(100vh - 420px)' }}>
          <div className="container">
            <form action={routes.LOGIN_ACTION} method="post" name="form">
              <h3 id="login">Je m‘identifie</h3>
              {!!error && <ErrorBox title={error} />}
              <div className="form__group">
                <label htmlFor="email">Courrier électronique</label>
                <input type="email" name="email" id="email" {...dataId('email-field')} />
                <Button
                  type="submit"
                  name="submit"
                  id="submit"
                  {...dataId('submit-button')}
                  className="mt-2"
                >
                  Je m'identifie
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </PageTemplate>
  );
};

hydrateOnClient(FakeLogin);
