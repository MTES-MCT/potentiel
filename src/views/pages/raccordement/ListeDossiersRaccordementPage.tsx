import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Heading1, PageTemplate, Tile } from '@components';
import { hydrateOnClient } from '../../helpers';

type ListeDossiersRaccordementProps = {
  user: UtilisateurReadModel;
  références: Array<string>;
};

export const ListeDossiersRaccordement = ({ user, références }: ListeDossiersRaccordementProps) => {
  return (
    <PageTemplate user={user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Dossiers de raccordement</Heading1>
        </div>
        {références.map((référence) => (
          <Tile>Référence dossier de raccordement : {référence}</Tile>
        ))}
      </div>
    </PageTemplate>
  );
};
hydrateOnClient(ListeDossiersRaccordement);
