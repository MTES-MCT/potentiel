import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Heading1, LinkButton, ListeVide, LegacyPageTemplate, SuccessBox } from '@components';
import { hydrateOnClient } from '@views/helpers';
import React from 'react';
import { Liste } from './components/Liste';
import routes from '@routes';
import { GestionnaireRéseauReadModel } from '@potentiel/domain-views';

type ListeGestionnairesRéseauProps = {
  user: UtilisateurReadModel;
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
  success?: string;
};

export const ListeGestionnairesRéseau = ({
  user,
  gestionnairesRéseau,
  success,
}: ListeGestionnairesRéseauProps) => (
  <LegacyPageTemplate user={user} currentPage={'liste-gestionnaires-réseau'}>
    <div className="panel flex flex-col">
      <Heading1>Liste des gestionnaires de réseau</Heading1>
      {success && <SuccessBox title={success} className="mb-4" />}
      <LinkButton href={routes.GET_AJOUTER_GESTIONNAIRE_RESEAU} className="mb-4 self-end">
        Ajouter
      </LinkButton>
      {gestionnairesRéseau.length === 0 ? (
        <ListeVide titre="Aucun gestionnaire de réseau" />
      ) : (
        <Liste {...{ gestionnairesRéseau }} />
      )}
    </div>
  </LegacyPageTemplate>
);

hydrateOnClient(ListeGestionnairesRéseau);
