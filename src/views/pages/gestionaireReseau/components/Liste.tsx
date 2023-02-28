import { ListeGestionnairesRéseauReadModel } from '@modules/gestionnaireRéseau';
import routes from '@routes';
import { Link, Tile } from '@views/components';
import React, { FC } from 'react';

type ListeProps = {
  gestionnairesRéseau: ListeGestionnairesRéseauReadModel;
};
export const Liste: FC<ListeProps> = ({ gestionnairesRéseau }) => (
  <ul className="m-0 p-0 list-none">
    {gestionnairesRéseau.map(({ raisonSociale, codeEIC }) => (
      <li key={`gestionnaire-reseau-${codeEIC}`} className="m-0 mb-3 p-0">
        <Tile className="flex justify-between">
          <div className="font-bold">{raisonSociale}</div>
          <Link href={routes.GET_DETAIL_GESTIONNAIRE_RESEAU(codeEIC)}>Voir</Link>
        </Tile>
      </li>
    ))}
  </ul>
);
