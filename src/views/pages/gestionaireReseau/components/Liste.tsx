import { Link, Tile } from '../../../components';
import React, { FC } from 'react';
import { GestionnaireRéseauReadModel } from '@potentiel/domain-views';
import { GET_GESTIONNAIRE_RESEAU } from '@potentiel/legacy-routes';

type ListeProps = {
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
};
export const Liste: FC<ListeProps> = ({ gestionnairesRéseau }) => (
  <ul className="m-0 p-0 list-none">
    {gestionnairesRéseau.map(({ raisonSociale, codeEIC }) => (
      <li key={`gestionnaire-reseau-${codeEIC}`} className="m-0 mb-3 p-0">
        <Tile className="flex justify-between">
          <div className="font-bold">{raisonSociale}</div>
          <Link
            href={GET_GESTIONNAIRE_RESEAU(codeEIC)}
            aria-label={`Voir les détails pour ${raisonSociale}`}
          >
            Voir
          </Link>
        </Tile>
      </li>
    ))}
  </ul>
);
