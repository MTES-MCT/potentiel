import { Heading1, PageTemplate } from '@views/components';
import { hydrateOnClient } from '@views/helpers';
import { Request } from 'express';
import React from 'react';

type ListeGestionnairesRéseauProps = { request: Request };

export const ListeGestionnairesRéseau = ({ request: { user } }: ListeGestionnairesRéseauProps) => (
  <PageTemplate user={user}>
    <div className="panel">
      <div className="panel__header">
        <Heading1>Liste des gestionnaires de réseau</Heading1>
      </div>
    </div>
  </PageTemplate>
);

hydrateOnClient(ListeGestionnairesRéseau);
