import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Heading1, PageTemplate, Tile } from '@components';
import { hydrateOnClient } from '../../helpers';
import { ListeDossiersRaccordementReadModel } from '@potentiel/domain/src/raccordement/lister/listeDossierRaccordement.readModel';

type DossiersRaccordementProps = {
  user: UtilisateurReadModel;
  dossiersRaccordement: ListeDossiersRaccordementReadModel;
};

export const DossiersRaccordement = ({ user }: DossiersRaccordementProps) => {
  return (
    <PageTemplate user={user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Raccordement</Heading1>
          <ul>
            <li>
              <Tile>
                <ul>
                  <li>Demande complète de raccordement</li>
                  <li>Proposition technique et financière</li>
                  <li>Date de mise en service</li>
                </ul>
              </Tile>
            </li>
          </ul>
        </div>
      </div>
    </PageTemplate>
  );
};
hydrateOnClient(DossiersRaccordement);
