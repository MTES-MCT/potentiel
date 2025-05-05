import React from 'react';
import { Heading3, Link } from '../../../components';
import { GetProducteurForProjectPage } from '../../../../controllers/project/getProjectPage/_utils/getProducteur';

export type InfoProducteurProps = {
  producteur: GetProducteurForProjectPage;
  modificationsPermisesParLeCDCActuel: boolean;
};

export const InfoProducteur = ({
  producteur,
  modificationsPermisesParLeCDCActuel,
}: InfoProducteurProps) => {
  return (
    <div>
      <Heading3 className="m-0">Producteur</Heading3>
      <p className="m-0">{producteur.producteur || 'Non renseigné'}</p>
      {modificationsPermisesParLeCDCActuel && producteur.affichage && (
        <Link
          href={producteur.affichage.url}
          aria-label={producteur.affichage.label}
          className="mt-1"
        >
          {producteur.affichage.label}
        </Link>
      )}
    </div>
  );
};
