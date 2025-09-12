import React from 'react';
import { Heading3, Link } from '../../../../components';

import { GetInstallationAvecDispositifDeStockageForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getInstallationAvecDispositifDeStockage';

export type InfoInstallationAvecDispositifDeStockageProps = {
  installationAvecDispositifDeStockage: GetInstallationAvecDispositifDeStockageForProjectPage;
};

export const InfoInstallationAvecDispositifDeStockage = ({
  installationAvecDispositifDeStockage,
}: InfoInstallationAvecDispositifDeStockageProps) => {
  const value = installationAvecDispositifDeStockage.installationAvecDispositifDeStockage;
  return (
    <div className="flex flex-col gap-0">
      <Heading3 className="m-0">Installation couplée à un dispositif de stockage</Heading3>
      <span>{value === true ? 'oui' : value === false ? 'non' : 'Non renseigné'}</span>
      {installationAvecDispositifDeStockage.affichage && (
        <Link
          href={installationAvecDispositifDeStockage.affichage.url}
          aria-label={installationAvecDispositifDeStockage.affichage.label}
        >
          {installationAvecDispositifDeStockage.affichage.label}
        </Link>
      )}
    </div>
  );
};
