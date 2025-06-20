import React, { FC } from 'react';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

export type ListeFournisseursProps = {
  fournisseurs: PlainType<Array<Lauréat.Fournisseur.Fournisseur.ValueType>>;
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

export const ListeFournisseurs: FC<ListeFournisseursProps> = ({ fournisseurs }) => {
  const fournisseursGroupedByType = Object.entries(
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
  );

  return (
    <ul className="my-1">
      {fournisseursGroupedByType.map(([typeFournisseur, nomsDesFabricants]) => (
        <li key={typeFournisseur}>
          <span>
            {typeFournisseurLabel[typeFournisseur as Lauréat.Fournisseur.TypeFournisseur.RawType]} :{' '}
            {nomsDesFabricants.join(', ')}
          </span>
        </li>
      ))}
    </ul>
  );
};
