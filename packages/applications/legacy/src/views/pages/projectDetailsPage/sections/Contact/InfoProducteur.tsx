import React from 'react';
import { Heading3, Link } from '../../../../components';
import { GetProducteurForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getProducteur';

export type InfoProducteurProps = {
  producteur: GetProducteurForProjectPage;
};

export const InfoProducteur = ({ producteur }: InfoProducteurProps) => {
  return (
    <div className="flex flex-col gap-0">
      <Heading3 className="m-0">Producteur</Heading3>
      <span>{producteur.producteur || 'Non renseigné'}</span>
      {producteur.affichage && (
        <Link href={producteur.affichage.url} aria-label={producteur.affichage.label}>
          {producteur.affichage.label}
        </Link>
      )}
    </div>
  );
};
