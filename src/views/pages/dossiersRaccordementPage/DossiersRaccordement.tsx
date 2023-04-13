import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Heading1, PageTemplate, Tile } from '@components';
import { hydrateOnClient } from '../../helpers';
import { ListeDossiersRaccordementReadModel } from '@potentiel/domain';

type DossiersRaccordementProps = {
  user: UtilisateurReadModel;
  dossiersRaccordement: ListeDossiersRaccordementReadModel;
};

export const DossiersRaccordement = ({ user, dossiersRaccordement }: DossiersRaccordementProps) => {
  return (
    <PageTemplate user={user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Raccordement</Heading1>
          <ul>
            {dossiersRaccordement.références.map((dossierRaccordement) => (
              <li>
                <Tile>{dossierRaccordement}</Tile>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageTemplate>
  );
};
hydrateOnClient(DossiersRaccordement);
