import routes from '@potentiel/routes';
import { Link, Tile } from '@potentiel/ui';
import React, { FC } from 'react';
import { GestionnaireRéseauReadModel } from '@potentiel/domain-views';

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
            href={routes.GET_DETAIL_GESTIONNAIRE_RESEAU(codeEIC)}
            aria-label={`Voir les détails pour ${raisonSociale}`}
          >
            Voir
          </Link>
        </Tile>
      </li>
    ))}
  </ul>
);
