import React, { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';

export type ListeFournisseursProps = {
  fournisseurs: Array<{
    typeFournisseur: Lauréat.Fournisseur.TypeFournisseur.RawType;
    nomDuFabricant: string;
  }>;
};

const typeFournisseurLabel: Record<Lauréat.Fournisseur.TypeFournisseur.RawType, string> = {
  'module-ou-films': 'Modules ou films',
  cellules: 'Cellules',
  'plaquettes-silicium': 'Plaquettes de silicium (wafers)',
  polysilicium: 'Polysilicium',
  'postes-conversion': 'Postes de conversion',
  structure: 'Structure',
  'dispositifs-stockage-energie': `Dispositifs de stockage de l'énergie`,
  'dispositifs-suivi-course-soleil': 'Dispositifs de suivi de la course du soleil',
  'autres-technologies': 'Autres technologies',
  'dispositif-de-production': 'Dispositif de production',
  'dispositif-de-stockage': 'Dispositif de stockage',
  'poste-conversion': 'Poste de conversion',
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
