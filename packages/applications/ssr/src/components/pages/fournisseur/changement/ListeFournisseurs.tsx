import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';

import { typeFournisseurLabel } from './typeFournisseurLabel';

export type ListeFournisseursProps = {
  fournisseurs: Array<{
    typeFournisseur: Lauréat.Fournisseur.TypeFournisseur.RawType;
    nomDuFabricant: string;
  }>;
};

export const ListeFournisseurs: FC<ListeFournisseursProps> = ({ fournisseurs }) =>
  Object.entries(
    fournisseurs.reduce(
      (prev, { nomDuFabricant, typeFournisseur }) => ({
        ...prev,
        [typeFournisseur]: [...(prev[typeFournisseur] ?? []), nomDuFabricant],
      }),
      {} as Record<Lauréat.Fournisseur.TypeFournisseur.RawType, string[]>,
    ),
  ).map(([typeFournisseur, nomsDesFabricants]) => (
    <div key={typeFournisseur}>
      {typeFournisseurLabel[typeFournisseur as Lauréat.Fournisseur.TypeFournisseur.RawType]} :{' '}
      {nomsDesFabricants.join(', ')}
    </div>
  ));
