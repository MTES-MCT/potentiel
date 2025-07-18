import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { typeFournisseurLabel } from './typeFournisseurLabel';

export type ListeFournisseursProps = {
  fournisseurs: PlainType<Array<Lauréat.Fournisseur.Fournisseur.ValueType>>;
};

export const ListeFournisseurs: FC<ListeFournisseursProps> = ({ fournisseurs }) =>
  fournisseurs.length === 0 ? (
    <div>Aucun fournisseur renseigné</div>
  ) : (
    <ul className="list-disc pl-4">
      {/* TODO We can use Object.groupBy starting from Node 21+  */}
      {Object.entries(
        fournisseurs.reduce(
          (prev, { nomDuFabricant, lieuDeFabrication, typeFournisseur: { typeFournisseur } }) => ({
            ...prev,
            [typeFournisseur]: [
              ...(prev[typeFournisseur] ?? []),
              lieuDeFabrication ? `${nomDuFabricant} (${lieuDeFabrication})` : nomDuFabricant,
            ],
          }),
          {} as Record<Lauréat.Fournisseur.TypeFournisseur.RawType, string[]>,
        ),
      ).map(([typeFournisseur, nomsDesFabricants]) => (
        <li key={typeFournisseur}>
          {typeFournisseurLabel[typeFournisseur as Lauréat.Fournisseur.TypeFournisseur.RawType]} :{' '}
          {nomsDesFabricants.join(', ')}
        </li>
      ))}
    </ul>
  );
