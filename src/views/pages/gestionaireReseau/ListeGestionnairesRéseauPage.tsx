import { ListeGestionnairesRéseauReadModel } from '@modules/gestionnaireRéseau';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Heading1, ListeVide, PageTemplate, SuccessBox } from '@components';
import { hydrateOnClient } from '@views/helpers';
import React from 'react';
import { Liste } from './components/Liste';

type ListeGestionnairesRéseauProps = {
  user: UtilisateurReadModel;
  gestionnairesRéseau: ListeGestionnairesRéseauReadModel;
  success?: string;
};

export const ListeGestionnairesRéseau = ({
  user,
  gestionnairesRéseau,
  success,
}: ListeGestionnairesRéseauProps) => (
  <PageTemplate user={user} currentPage={'liste-gestionnaires-réseau'}>
    <div className="panel flex flex-col">
      <div className="panel__header">
        <Heading1>Liste des gestionnaires de réseau</Heading1>
      </div>
      {success && <SuccessBox title={success} className="mb-4" />}
      {/* <LinkButton href={routes.GET_AJOUTER_GESTIONNAIRE_RESEAU} className="mb-4 self-end">
        Ajouter
      </LinkButton> */}
      {gestionnairesRéseau.length === 0 ? (
        <ListeVide titre="Aucun gestionnaire de réseau" />
      ) : (
        <Liste {...{ gestionnairesRéseau }} />
      )}
    </div>
  </PageTemplate>
);

hydrateOnClient(ListeGestionnairesRéseau);
