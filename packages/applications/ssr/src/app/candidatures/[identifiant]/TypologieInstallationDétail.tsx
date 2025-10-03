import { FC } from 'react';

import { Candidature } from '@potentiel-domain/projet';

type TypologieInstallationProps = Candidature.Dépôt.RawType['typologieInstallation'];

export const TypologieInstallationDétail: FC<TypologieInstallationProps> = (
  typologieInstallation,
) => {
  const formatTypologie = (typologie: TypologieInstallationProps[0]['typologie']) => {
    const formatted = typologie.replace(/-/g, ' ').replace(/\./g, ' : ');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <>
      {typologieInstallation.length > 1 ? (
        <ul className="list-disc pl-4">
          {typologieInstallation.map(({ typologie, détails }) => (
            <li key={typologie}>
              <div>{formatTypologie(typologie)}</div>
              {détails && <div>Éléments sous l'installation : {détails}</div>}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <div>{formatTypologie(typologieInstallation[0].typologie)}</div>
          {typologieInstallation[0].détails && (
            <div>Éléments sous l'installation : {typologieInstallation[0].détails}</div>
          )}
        </div>
      )}
    </>
  );
};
