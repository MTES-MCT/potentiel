import { GestionnaireRéseauReadModel } from '@modules/gestionnaireRéseau/lister/ListerGestionnairesRéseau';
import { Tile } from '@views/components';
import React, { FC } from 'react';

type ListeProps = {
  gestionnairesRéseau: Array<GestionnaireRéseauProps>;
};
export const Liste: FC<ListeProps> = ({ gestionnairesRéseau }) => (
  <ul className="m-0 p-0 list-none">
    {gestionnairesRéseau.map((gestionnaireRéseau) => (
      <li key={`gestionnaire-reseau-${gestionnaireRéseau.id}`} className="m-0 mb-3 p-0">
        <Tile>
          <GestionnaireRéseau {...gestionnaireRéseau} />
        </Tile>
      </li>
    ))}
  </ul>
);

type GestionnaireRéseauProps = GestionnaireRéseauReadModel;
const GestionnaireRéseau: FC<GestionnaireRéseauProps> = ({ nom }) => (
  <div className="font-bold">{nom}</div>
);
