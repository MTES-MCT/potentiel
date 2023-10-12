import React from 'react';

import {
  UtilisateurReadModel,
  convertirEnUtilisateurLegacyReadModel,
} from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { PageProjetTemplate, PlugIcon, ListeVide, Link } from '@potentiel/ui';
import { hydrateOnClient } from '../../helpers';
import { CandidatureLegacyReadModel } from '@potentiel/domain-views';
import routes from '@potentiel/routes';

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
    user={convertirEnUtilisateurLegacyReadModel(user)}
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
