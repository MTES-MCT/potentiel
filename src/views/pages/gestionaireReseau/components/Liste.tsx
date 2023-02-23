import { ListeGestionnairesRéseauReadModel } from '@modules/gestionnaireRéseau';
import { Tile } from '@views/components';
import React, { FC } from 'react';

type ListeProps = {
  gestionnairesRéseau: ListeGestionnairesRéseauReadModel;
};
export const Liste: FC<ListeProps> = ({ gestionnairesRéseau }) => (
  <ul className="m-0 p-0 list-none">
    {gestionnairesRéseau.map(({ nom, id }) => (
      <li key={`gestionnaire-reseau-${id}`} className="m-0 mb-3 p-0">
        <Tile>
          <div className="font-bold">{nom}</div>
        </Tile>
      </li>
    ))}
  </ul>
);
