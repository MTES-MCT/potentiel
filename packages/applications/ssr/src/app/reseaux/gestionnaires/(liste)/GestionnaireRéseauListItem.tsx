import Button from '@codegouvfr/react-dsfr/Button';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { Link } from '@/components/atoms/LinkNoPrefetch';
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
      heading={<span className="font-bold">{raisonSociale}</span>}
      actions={
        <Button
          linkProps={{
            href: Routes.Gestionnaire.détail(identifiantGestionnaireReseauValue.formatter()),
          }}
          aria-label={`modifier les détails du gestionnaire de réseau ${raisonSociale}`}
        >
          Modifier
        </Button>
      }
    >
      <p>
        {nombreRaccordements} projet{nombreRaccordements > 1 ? 's' : ''} raccordé
        {nombreRaccordements > 1 ? 's' : ''}
      </p>
      {nombreRaccordements ? (
        <Link
          href={Routes.Raccordement.lister({
            identifiantGestionnaireReseau: identifiantGestionnaireRéseau.codeEIC,
          })}
        >
          Voir les dossiers de raccordement
        </Link>
      ) : (
        ''
      )}
    </ListItem>
  );
};
