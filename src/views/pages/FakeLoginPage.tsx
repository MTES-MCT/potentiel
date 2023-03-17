import { Request } from 'express';
import React from 'react';
import { dataId } from '../../helpers/testId';
import routes from '@routes';
import { Button, ErrorBox, Input, Label, PageTemplate } from '@components';
import { hydrateOnClient } from '../helpers';

interface FakeLoginProps {
  request: Request;
}

export const FakeLogin = ({ request }: FakeLoginProps) => {
  const { error } = (request.query as any) || {};
  return (
    <PageTemplate user={request.user}>
      <section className="flex justify-center items-center h-[calc(100vh-420px)]">
        <form action={routes.LOGIN_ACTION} method="post" name="form">
          <h3 id="login">Je m‘identifie</h3>
          {!!error && <ErrorBox title={error} />}
          <Label htmlFor="email">Courrier électronique</Label>
          <Input
            type="email"
            name="email"
            id="email"
            {...dataId('email-field')}
            defaultValue="admin@test.test"
          />
          <Button
            type="submit"
            name="submit"
            id="submit"
            {...dataId('submit-button')}
            className="mt-2"
          >
            Je m'identifie
          </Button>
        </form>
      </section>
    </PageTemplate>
  );
};

hydrateOnClient(FakeLogin);
