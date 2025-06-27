import React from 'react';
import { Heading3, Link } from '../../../../components';

import { GetRaccordementForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';

type InfoRaccordementProps = {
  raccordement: GetRaccordementForProjectPage;
};

export const InfoRaccordement = ({ raccordement }: InfoRaccordementProps) => {
  if (!raccordement?.affichage) {
    return null;
  }

  return (
    <div className="print:hidden">
      <Heading3 className="m-0">Raccordement au réseau</Heading3>
      {raccordement.affichage.url ? (
        <Link href={raccordement.affichage.url}>{raccordement.affichage.label}</Link>
      ) : (
        <div>{raccordement.affichage.label}</div>
      )}
    </div>
  );
};
