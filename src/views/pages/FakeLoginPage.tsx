import { Request } from 'express';
import React from 'react';
import routes from '@routes';
import { PrimaryButton, ErrorBox, LegacyPageTemplate, Label, Input } from '@components';
import { hydrateOnClient } from '../helpers';

interface FakeLoginProps {
  request: Request;
}

export const FakeLogin = ({ request }: FakeLoginProps) => {
  const { error } = (request.query as any) || {};
  return (
    <LegacyPageTemplate user={request.user}>
      <main role="main">
        <section className="section section-grey" style={{ minHeight: 'calc(100vh - 420px)' }}>
          <div className="container">
            <form action={routes.LOGIN_ACTION} method="post" name="form">
              <h3 id="login">Je m‘identifie</h3>
              {!!error && <ErrorBox title={error} />}
              <div className="form__group">
                <Label htmlFor="email">Courrier électronique</Label>
                <Input type="email" name="email" id="email" />
                <PrimaryButton type="submit" name="submit" id="submit" className="mt-2">
                  Je m'identifie
                </PrimaryButton>
              </div>
            </form>
          </div>
        </section>
      </main>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(FakeLogin);
