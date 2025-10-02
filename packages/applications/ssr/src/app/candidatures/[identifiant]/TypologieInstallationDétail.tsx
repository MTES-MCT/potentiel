import { FC } from 'react';

import { Candidature } from '@potentiel-domain/projet';

type TypologieInstallationProps = Candidature.Dépôt.RawType['typologieInstallation'];

export const TypologieInstallationDétail: FC<TypologieInstallationProps> = (
  typologieInstallation,
) => {
  const formatTypologie = ({ typologie, détails }: TypologieInstallationProps[0]) => (
    <>
      <div>
        {typologie.charAt(0).toUpperCase() +
          typologie.slice(1).replace(/-/g, ' ').replace(/\./g, ' : ')}
      </div>
      {détails && <div>Éléments sous l'installation : {détails}</div>}
    </>
  );

  return (
    <>
      {typologieInstallation.length > 1 ? (
        <ul className="list-disc pl-4">
          {typologieInstallation.map((typologieInstallation) => (
            <li key={typologieInstallation.typologie}>{formatTypologie(typologieInstallation)}</li>
          ))}
        </ul>
      ) : (
        <div>{formatTypologie(typologieInstallation[0])}</div>
      )}
    </>
  );
};
