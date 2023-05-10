import { Request } from 'express';
import React from 'react';
import { PageTemplate } from '@components';
import { hydrateOnClient } from '../helpers';
import { Heading1 } from '../components/UI/atoms/Heading1';

type MaintenanceProps = {
  user: Request['user'];
};

export const Maintenance = ({ user }: MaintenanceProps) => (
  <PageTemplate user={user}>
    <Heading1>TEST</Heading1>
  </PageTemplate>
);

hydrateOnClient(Maintenance);
