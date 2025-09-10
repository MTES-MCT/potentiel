import React from 'react';
import { Heading3, Link } from '../../../../components';

import { GetInstallateurForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getInstallateur';

export type InfoInstallateurProps = {
  installateur: GetInstallateurForProjectPage;
};

export const InfoInstallateur = ({ installateur }: InfoInstallateurProps) => {
  return (
    <div className="flex flex-col gap-0">
      <Heading3 className="m-0">Installateur</Heading3>
      <span>{installateur.installateur}</span>
      {installateur.affichage && (
        <Link href={installateur.affichage.url} aria-label={installateur.affichage.label}>
          {installateur.affichage.label}
        </Link>
      )}
    </div>
  );
};
