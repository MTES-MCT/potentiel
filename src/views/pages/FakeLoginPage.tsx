import { Request } from 'express';
import React from 'react';
import routes from '@routes';
import { PrimaryButton, ErrorBox, LegacyPageTemplate, Label, Input, Form } from '@components';
import { hydrateOnClient } from '../helpers';

interface FakeLoginProps {
  request: Request;
}

export const FakeLogin = ({ request }: FakeLoginProps) => {
  const { error } = (request.query as any) || {};
  return (
    <LegacyPageTemplate user={request.user}>
      <main role="main">
        <section className="min-h-[calc(100vh-420px)] flex items-center justify-around   gap-6">
          <Form action={routes.LOGIN_ACTION} method="post" name="form">
            <h3 className="m-0">Je m‘identifie</h3>
            {!!error && <ErrorBox title={error} />}
            <div>
              <Label htmlFor="email">Courrier électronique</Label>
              <Input type="email" name="email" id="email" />
            </div>
            <PrimaryButton type="submit" name="submit" id="submit" className="mt-2">
              Je m'identifie
            </PrimaryButton>
          </Form>
          <img
            className="hidden lg:block self-center w-full p-4 lg:w-1/2 object-scale-down"
            src="/images/home/enr-illustration.png"
            aria-hidden
            alt=""
          />
        </section>
      </main>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(FakeLogin);
