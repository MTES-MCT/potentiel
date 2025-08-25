import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { typeFournisseurLabel } from './typeFournisseurLabel';

export type ListeFournisseursProps = {
  fournisseurs: PlainType<Array<Lauréat.Fournisseur.Fournisseur.ValueType>>;
};

export const ListeFournisseurs: FC<ListeFournisseursProps> = ({ fournisseurs }) => {
  if (fournisseurs.length === 0) {
    return <div>Aucun fournisseur renseigné</div>;
  }
  const fournisseursParType = Object.groupBy(
    fournisseurs,
    (fournisseur) => fournisseur.typeFournisseur.typeFournisseur,
  );

  return (
    <ul className="list-disc pl-4">
      {Object.entries(fournisseursParType).map(([typeFournisseur, fournisseurs]) => (
        <li key={typeFournisseur}>
          {typeFournisseurLabel[typeFournisseur as Lauréat.Fournisseur.TypeFournisseur.RawType]} :{' '}
          {fournisseurs
            .map(({ nomDuFabricant, lieuDeFabrication }) =>
              lieuDeFabrication ? `${nomDuFabricant} (${lieuDeFabrication})` : nomDuFabricant,
            )
            .join(', ')}
        </li>
      ))}
    </ul>
  );
};
