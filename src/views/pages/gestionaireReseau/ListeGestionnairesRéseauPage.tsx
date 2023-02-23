import { ListeGestionnairesRéseauReadModel } from '@modules/gestionnaireRéseau/lister/ListerGestionnairesRéseau';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Heading1, PageTemplate } from '@views/components';
import { hydrateOnClient } from '@views/helpers';
import React from 'react';
import { AucunGestionnaireRéseau } from './components/AucunGestionnaireRéseau';
import { Liste } from './components/Liste';

type ListeGestionnairesRéseauProps = {
  user: UtilisateurReadModel;
  gestionnairesRéseau: ListeGestionnairesRéseauReadModel;
};

export const ListeGestionnairesRéseau = ({
  user,
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
