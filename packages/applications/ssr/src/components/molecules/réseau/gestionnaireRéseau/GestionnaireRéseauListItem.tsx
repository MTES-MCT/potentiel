import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { GestionnaireAvecNombreDeRaccordement } from '../../../pages/réseau/gestionnaire/lister/GestionnaireRéseauList.page';

type GestionnaireRéseauListItemProps = PlainType<GestionnaireAvecNombreDeRaccordement>;

export const GestionnaireRéseauListItem: FC<GestionnaireRéseauListItemProps> = ({
  identifiantGestionnaireRéseau,
  raisonSociale,
  nombreRaccordements,
}) => {
  const identifiantGestionnaireReseauValue = GestionnaireRéseau.IdentifiantGestionnaireRéseau.bind(
    identifiantGestionnaireRéseau,
  );

  return (
    <>
      <div>
        <div className="flex flex-col gap-1">
          <h2 className="leading-4">
            <span className="font-bold">{raisonSociale}</span>
          </h2>
          <p>
            {nombreRaccordements} raccordement{nombreRaccordements > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between mt-4 md:mt-2">
        <a
          href={Routes.Gestionnaire.détail(identifiantGestionnaireReseauValue.formatter())}
          className="self-end mt-2"
          aria-label={`voir le détails du gestionnaire de réseau ${raisonSociale}`}
        >
          voir
        </a>
      </div>
    </>
  );
};
