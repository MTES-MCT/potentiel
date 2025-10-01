import React from 'react';

import { Heading3, Link } from '../../../../components';

import { GetDispositifDeStockageForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getDispositifDeStockage';

export type InfoDispositifDeStockageProps = {
  dispositifDeStockage: GetDispositifDeStockageForProjectPage;
};

export const InfoDispositifDeStockage = ({
  dispositifDeStockage,
}: InfoDispositifDeStockageProps) => {
  const {
    installationAvecDispositifDeStockage,
    capacitéDuDispositifDeStockageEnKw,
    puissanceDuDispositifDeStockageEnKw,
  } = dispositifDeStockage.dispositifDeStockage;

  return (
    <div className="flex flex-col gap-0">
      <Heading3 className="m-0">Dispositif de stockage</Heading3>
      <span>
        {installationAvecDispositifDeStockage === true
          ? 'Avec'
          : installationAvecDispositifDeStockage === false
            ? 'Sans'
            : 'Non renseigné'}
      </span>
      {puissanceDuDispositifDeStockageEnKw ? (
        <span>Puissance du dispositif de stockage : ${puissanceDuDispositifDeStockageEnKw} Kw</span>
      ) : null}
      {capacitéDuDispositifDeStockageEnKw ? (
        <span>Capacité du dispositif de stockage : ${capacitéDuDispositifDeStockageEnKw} Kw</span>
      ) : null}
      {dispositifDeStockage.affichage && (
        <Link
          href={dispositifDeStockage.affichage.url}
          aria-label={dispositifDeStockage.affichage.label}
        >
          {dispositifDeStockage.affichage.label}
        </Link>
      )}
    </div>
  );
};
