import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';

import { typeFournisseurLabel } from './typeFournisseurLabel';

export type ListeFournisseursProps = {
  fournisseurs: Array<Lauréat.Fournisseur.Fournisseur.RawType>;
};

export const ListeFournisseurs: FC<ListeFournisseursProps> = ({ fournisseurs }) => (
  <ul className="list-disc pl-4">
    {/* TODO We can use Object.groupBy starting from Node 21+  */}
    {Object.entries(
      fournisseurs.reduce(
        (prev, { nomDuFabricant, typeFournisseur }) => ({
          ...prev,
          [typeFournisseur]: [...(prev[typeFournisseur] ?? []), nomDuFabricant],
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
