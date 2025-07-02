import React from 'react';
import { Heading3, Link } from '../../../../components';
import { GetProducteurForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getProducteur';
import { Role } from '@potentiel-domain/utilisateur';

export type InfoProducteurProps = {
  producteur: GetProducteurForProjectPage;
  modificationsPermisesParLeCDCActuel: boolean;
  role: Role.ValueType;
};

export const InfoProducteur = ({
  producteur,
  modificationsPermisesParLeCDCActuel,
  role,
}: InfoProducteurProps) => {
  const afficherSelonRole =
    (role.estPorteur() && modificationsPermisesParLeCDCActuel) || !role.estPorteur();

  return (
    <div className="flex flex-col gap-0">
      <Heading3 className="m-0">Producteur</Heading3>
      <span>{producteur.producteur || 'Non renseigné'}</span>
      {afficherSelonRole && producteur.affichage && (
        <Link href={producteur.affichage.url} aria-label={producteur.affichage.label}>
          {producteur.affichage.label}
        </Link>
      )}
    </div>
  );
};
