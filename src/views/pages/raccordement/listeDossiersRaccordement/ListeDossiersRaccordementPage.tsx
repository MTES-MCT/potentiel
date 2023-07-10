import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Link, Tile, PageProjetTemplate, InfoBox, EditIcon } from '@components';
import { hydrateOnClient } from '../../../helpers';
import {
  GestionnaireRéseauReadModel,
  ConsulterProjetReadModel,
  DossierRaccordementReadModel,
} from '@potentiel/domain-views';
import routes from '@routes';
import { userIs } from '@modules/users';
import { Dossier } from './components/Dossier';
import { TitrePageRaccordement } from '../components/TitrePageRaccordement';

type ListeDossiersRaccordementProps = {
  user: UtilisateurReadModel;
  projet: ConsulterProjetReadModel;
  gestionnaireRéseau: GestionnaireRéseauReadModel;
  dossiers: ReadonlyArray<DossierRaccordementReadModel>;
};

export const ListeDossiersRaccordement = ({
  user,
  projet,
  gestionnaireRéseau,
  dossiers,
}: ListeDossiersRaccordementProps) => {
  const { identifiantProjet } = projet;

  return (
    <PageProjetTemplate titre={<TitrePageRaccordement />} user={user} résuméProjet={projet}>
      <div className="my-2 md:my-4">
        <p className="mt-2 mb-4 p-0">
          Gestionnaire de réseau : {gestionnaireRéseau.raisonSociale}
          {userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user) && (
            <Link
              className="ml-1"
              href={routes.GET_MODIFIER_GESTIONNAIRE_RESEAU_PROJET_PAGE(identifiantProjet)}
              aria-label={`Modifier le gestionnaire (actuel : ${gestionnaireRéseau.raisonSociale})`}
            >
              (<EditIcon className="mr-1" />
              Modifier)
            </Link>
          )}
        </p>
        {dossiers.length === 1 ? (
          <Dossier user={user} identifiantProjet={identifiantProjet} dossier={dossiers[0]} />
        ) : (
          dossiers.map((dossier) => (
            <Tile key={dossier.référence} className="mb-3">
              <Dossier user={user} identifiantProjet={identifiantProjet} dossier={dossier} />
            </Tile>
          ))
        )}
      </div>

      <InfoBox className="py-4">
        Si le raccordement comporte plusieurs points d'injection, vous pouvez{' '}
        <Link href={routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(identifiantProjet)}>
          transmettre une autre demande complète de raccordement
        </Link>
        .
      </InfoBox>
    </PageProjetTemplate>
  );
};

hydrateOnClient(ListeDossiersRaccordement);
