import { ListeGestionnairesRéseauReadModel } from '@modules/gestionnaireRéseau/lister/ListerGestionnairesRéseau';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Heading1, ListeVide, PageTemplate } from '@components';
import { hydrateOnClient } from '@views/helpers';
import React from 'react';
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
        <ListeVide titre="Aucun gestionnaire de réseau" />
      ) : (
        <Liste {...{ gestionnairesRéseau }} />
      )}
    </div>
  </PageTemplate>
);

hydrateOnClient(ListeGestionnairesRéseau);
