import React from 'react';

import { Candidature } from '@potentiel-domain/projet';

import { getTypologieInstallationLabel } from '@/app/laureats/[identifiant]/installation/typologie-de-l-installation/typologieInstallationLabel';

export const DétailTypologieInstallation = (
  typologieInstallation: Candidature.TypologieInstallation.RawType[],
) => {
  const formatTypologieInstallation = ({
    typologie,
    détails,
  }: Candidature.TypologieInstallation.RawType) => (
    <>
      <div>{getTypologieInstallationLabel(typologie)}</div>
      {détails && <div>Éléments sous l'installation : {détails}</div>}
    </>
  );
  return (
    <div>
      {typologieInstallation.length > 1 ? (
        <>
          <div className="m-0">Installation mixte :</div>
          <ul className="list-disc pl-4 m-0">
            {typologieInstallation.map((typologieInstallation) => (
              <li key={typologieInstallation.typologie}>
                {formatTypologieInstallation(typologieInstallation)}
              </li>
            ))}
          </ul>
        </>
      ) : typologieInstallation.length === 1 ? (
        <div>{formatTypologieInstallation(typologieInstallation[0])}</div>
      ) : (
        <span>Typologie du projet non renseignée</span>
      )}
    </div>
  );
};
