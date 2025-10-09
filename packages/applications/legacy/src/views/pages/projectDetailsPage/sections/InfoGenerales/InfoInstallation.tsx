import React from 'react';
import { Heading3, Heading4, Link } from '../../../../components';

import { GetInstallationForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getInstallation';

export type InfoInstallationProps = {
  installation: GetInstallationForProjectPage;
};

export const InfoInstallation = ({
  installation: { installateur, typologieInstallation },
}: InfoInstallationProps) => {
  const formatTypologie = ({
    typologie,
    détails,
  }: InfoInstallationProps['installation']['typologieInstallation']['value'][number]) => (
    <>
      <div>
        {typologie.charAt(0).toUpperCase() +
          typologie.slice(1).replace(/-/g, ' ').replace(/\./g, ' : ')}
      </div>
      {détails && <div>Éléments sous l'installation : {détails}</div>}
    </>
  );
  return (
    <div className="flex flex-col gap-0">
      <Heading3 className="m-0 ">Installation</Heading3>
      <div>
        <Heading4 className="m-0" style={{ fontSize: '16px' }}>
          Typologie du projet
        </Heading4>
        {typologieInstallation.value.length > 1 ? (
          <>
            <div className="m-0">Installation mixte :</div>
            <ul className="list-disc pl-4 m-0">
              {typologieInstallation.value.map((typologieInstallation) => (
                <li key={typologieInstallation.typologie}>
                  {formatTypologie(typologieInstallation)}
                </li>
              ))}
            </ul>
          </>
        ) : typologieInstallation.value.length === 1 ? (
          <div>{formatTypologie(typologieInstallation.value[0])}</div>
        ) : (
          <span>Typologie du projet non renseignée</span>
        )}
      </div>
      <div>
        <Heading4 className="m-0" style={{ fontSize: '16px' }}>
          Installateur
        </Heading4>
        <div className="m-0">{installateur.value || 'Non renseigné'}</div>
        {installateur.affichage && (
          <Link href={installateur.affichage.url} aria-label={installateur.affichage.label}>
            {installateur.affichage.label}
          </Link>
        )}
      </div>
    </div>
  );
};
