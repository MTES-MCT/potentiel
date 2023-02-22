import { GestionnaireRéseauReadModel } from '@modules/gestionnairesRéseau/lister/ListerGestionnairesRéseau';
import { Heading1, PageTemplate } from '@views/components';
import { hydrateOnClient } from '@views/helpers';
import { Request } from 'express';
import React from 'react';
import { AucunGestionnaireRéseau } from './components/AucunGestionnaireRéseau';
import { Liste } from './components/Liste';

type ListeGestionnairesRéseauProps = {
  request: Request;
  gestionnairesRéseau: Array<GestionnaireRéseauReadModel>;
};

export const ListeGestionnairesRéseau = ({
  request: { user },
  gestionnairesRéseau,
}: ListeGestionnairesRéseauProps) => (
  <PageTemplate user={user} currentPage={'liste-gestionnaires-réseau'}>
    <div className="panel">
      <div className="panel__header">
        <Heading1>Liste des gestionnaires de réseau</Heading1>
      </div>

      {gestionnairesRéseau.length === 0 ? (
        <AucunGestionnaireRéseau />
      ) : (
        <Liste {...{ gestionnairesRéseau }} />
      )}
    </div>
  </PageTemplate>
);

hydrateOnClient(ListeGestionnairesRéseau);
