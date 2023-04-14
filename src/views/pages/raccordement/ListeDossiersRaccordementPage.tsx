import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Heading1, Link, PageTemplate, Tile } from '@components';
import { hydrateOnClient } from '../../helpers';
import routes from '@routes';

type ListeDossiersRaccordementProps = {
  user: UtilisateurReadModel;
  références: Array<string>;
  projetId: string;
};

export const ListeDossiersRaccordement = ({
  user,
  références,
  projetId,
}: ListeDossiersRaccordementProps) => {
  return (
    <PageTemplate user={user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Dossiers de raccordement</Heading1>
        </div>
        {références.map((référence) => (
          <Tile key={référence} className="mb-3 flex flex-row items-center justify-between">
            <div>{référence}</div>
            <Link
              title={`Consulter le dossier de raccordement ${référence}`}
              href={routes.GET_DOSSIER_RACCORDEMENT_PAGE(projetId, référence)}
            >
              Consulter
            </Link>
          </Tile>
        ))}
      </div>
    </PageTemplate>
  );
};
hydrateOnClient(ListeDossiersRaccordement);
