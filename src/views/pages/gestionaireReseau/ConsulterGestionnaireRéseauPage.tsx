import React from 'react';
import { Heading1, PageTemplate } from '@views/components';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { hydrateOnClient } from '@views/helpers';

type DétailGestionnaireRéseauProps = {
  utilisateur: UtilisateurReadModel;
};

export const ConsulterGestionnaireRéseau = ({ utilisateur }: DétailGestionnaireRéseauProps) => (
  <PageTemplate user={utilisateur} currentPage={'liste-gestionnaires-réseau'}>
    <div className="panel">
      <div className="panel_header">
        <Heading1>Détail du gestionnaire de réseau</Heading1>
      </div>
    </div>
  </PageTemplate>
);

hydrateOnClient(ConsulterGestionnaireRéseau);
