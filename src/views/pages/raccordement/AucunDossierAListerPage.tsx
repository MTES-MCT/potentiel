import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { PageProjetTemplate, PlugIcon, ListeVide, Link } from '@components';
import { hydrateOnClient } from '../../helpers';
import { ConsulterProjetReadModel } from '@potentiel/domain-views';
import routes from '@routes';

type AucunDossierAListerProps = {
  user: UtilisateurReadModel;
  projet: ConsulterProjetReadModel;
};

export const AucunDossierALister = ({ user, projet }: AucunDossierAListerProps) => (
  <PageProjetTemplate
    titre={
      <>
        <PlugIcon className="mr-1" aria-hidden />
        Raccordement
      </>
    }
    user={user}
    résuméProjet={projet}
  >
    <ListeVide titre="Aucun dossier à lister" />

    <div className="mt-4">
      <Link href={routes.PROJECT_DETAILS(projet.identifiantProjet)}>
        Retour vers le détail du projet
      </Link>
    </div>
  </PageProjetTemplate>
);

hydrateOnClient(AucunDossierALister);
