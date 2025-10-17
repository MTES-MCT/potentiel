import React from 'react';

import { Candidature } from '@potentiel-domain/projet';

import { getTypologieInstallationLabel } from '@/app/laureats/[identifiant]/installation/typologie-du-projet/typologieInstallationLabel';

export const DétailTypologieInstallation = (
  typologieInstallation: Candidature.TypologieInstallation.RawType[],
) => {
  return (
    <div>
      {typologieInstallation.length > 0 ? (
        <>
          <ul className="list-disc pl-4 m-0">
            {typologieInstallation.map((t) => (
              <li key={t.typologie}>
                <div className="font-semibold">{getTypologieInstallationLabel(t.typologie)}</div>
                {t.détails && <div>Éléments sous l'installation : {t.détails}</div>}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <span>Typologie du projet non renseignée</span>
      )}
    </div>
  );
};
