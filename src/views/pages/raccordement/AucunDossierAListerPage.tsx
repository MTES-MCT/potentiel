import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { PageProjetTemplate, PlugIcon, ListeVide, Link } from '@components';
import { hydrateOnClient } from '../../helpers';
import { RésuméProjetReadModel } from '@potentiel/domain';
import routes from '@routes';

type AucunDossierAListerProps = {
  user: UtilisateurReadModel;
  identifiantProjet: string;
  résuméProjet: RésuméProjetReadModel;
};

export const AucunDossierALister = ({
  user,
  résuméProjet,
  identifiantProjet,
}: AucunDossierAListerProps) => (
  <PageProjetTemplate
    titre={
      <>
        <PlugIcon className="mr-1" aria-hidden />
        Raccordement
      </>
    }
    user={user}
    résuméProjet={résuméProjet}
  >
    <ListeVide titre="Aucun dossier à lister" />

    <div className="mt-4">
      <Link href={routes.PROJECT_DETAILS(identifiantProjet)}>Retour vers le détail du projet</Link>
    </div>
  </PageProjetTemplate>
);

hydrateOnClient(AucunDossierALister);
