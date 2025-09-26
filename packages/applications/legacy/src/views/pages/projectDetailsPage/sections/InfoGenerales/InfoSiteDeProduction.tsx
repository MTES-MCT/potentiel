import React, { FC } from 'react';
import { Candidature } from '@potentiel-domain/projet';
import { Heading3, Link } from '../../../../components';

export type InfoSiteDeProductionProps = {
  localité: Candidature.Localité.RawType;
  affichage?: {
    label: string;
    url: string;
  };
};

export const InfoSiteDeProduction: FC<InfoSiteDeProductionProps> = ({ localité, affichage }) => {
  return (
    <div>
      <Heading3 className="m-0">Site de production</Heading3>
      <div>{localité.adresse1}</div>
      {localité.adresse2 && <div>{localité.adresse2}</div>}
      <div>
        {localité.codePostal} {localité.commune}
      </div>
      <div>
        {localité.département}, {localité.région}
      </div>
      {affichage && (
        <Link href={affichage.url} aria-label={affichage.label}>
          {affichage.label}
        </Link>
      )}
    </div>
  );
};
