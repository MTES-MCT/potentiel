import Link from 'next/link';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { ListItem } from '@/components/molecules/ListItem';
import type { GestionnaireAvecNombreDeRaccordement } from './GestionnaireRéseauList.page';

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
    <ListItem
      heading={
        <h2 className="leading-4">
          <span className="font-bold">{raisonSociale}</span>
        </h2>
      }
      actions={
        <Link
          href={Routes.Gestionnaire.détail(identifiantGestionnaireReseauValue.formatter())}
          aria-label={`voir le détails du gestionnaire de réseau ${raisonSociale}`}
        >
          voir
        </Link>
      }
    >
      <p>
        {nombreRaccordements} raccordement{nombreRaccordements > 1 ? 's' : ''}
      </p>
    </ListItem>
  );
};
