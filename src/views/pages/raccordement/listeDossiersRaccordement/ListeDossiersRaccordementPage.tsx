import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Link, Tile, PageProjetTemplate, PlugIcon, InfoBox, EditIcon } from '@components';
import { hydrateOnClient } from '../../../helpers';
import { RawIdentifiantProjet } from '@potentiel/domain';
import { GestionnaireRéseauReadModel, RésuméProjetReadModel } from '@potentiel/domain-views';
import routes from '@routes';
import { userIs } from '@modules/users';
import { Dossier } from './components/Dossier';

type ListeDossiersRaccordementProps = {
  user: UtilisateurReadModel;
  identifiantProjet: RawIdentifiantProjet;
  résuméProjet: RésuméProjetReadModel;
  gestionnaireRéseau: GestionnaireRéseauReadModel;
  dossiers: ReadonlyArray<Dossier>;
};

export const ListeDossiersRaccordement = ({
  user,
  identifiantProjet,
  résuméProjet,
  gestionnaireRéseau,
  dossiers,
}: ListeDossiersRaccordementProps) => (
  <PageProjetTemplate
    titre={
      <div className="flex flex-row">
        <PlugIcon className="mr-1" aria-hidden />
        <div>
          <div>Raccordement</div>
          <div className="font-normal text-sm">
            <p className="my-2 p-0">
              Gestionnaire de réseau : {gestionnaireRéseau.raisonSociale}
              {userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user) && (
                <Link
                  className="ml-1"
                  href={routes.GET_MODIFIER_GESTIONNAIRE_RESEAU_PROJET_PAGE(identifiantProjet)}
                >
                  (<EditIcon className="mr-1" />
                  Modifier)
                </Link>
              )}
            </p>
          </div>
        </div>
      </div>
    }
    user={user}
    résuméProjet={résuméProjet}
  >
    <div className="my-2 md:my-4">
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

hydrateOnClient(ListeDossiersRaccordement);
