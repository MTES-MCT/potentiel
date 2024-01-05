import React from 'react';

import { UtilisateurReadModel } from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { PageProjetTemplate, PlugIcon, ListeVide, Link } from '../../components';
import { hydrateOnClient } from '../../helpers';
import { CandidatureLegacyReadModel } from '@potentiel/domain-views';
import { GET_PROJET } from '@potentiel/legacy-routes';

type AucunDossierAListerProps = {
  user: UtilisateurReadModel;
  projet: CandidatureLegacyReadModel;
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
      <Link href={GET_PROJET(projet.identifiantProjet)}>Retour vers le détail du projet</Link>
    </div>
  </PageProjetTemplate>
);

hydrateOnClient(AucunDossierALister);
