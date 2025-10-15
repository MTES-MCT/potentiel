import React from 'react';

import { Candidature } from '@potentiel-domain/projet';

import { getTypologieDuProjetLabel } from '@/app/laureats/[identifiant]/installation/typologie-du-projet/typologieDuProjetLabel';

export const DétailTypologieDuProjet = (
  typologieDuProjet: Candidature.TypologieDuProjet.RawType[],
) => {
  return (
    <div>
      {typologieDuProjet.length > 0 ? (
        <>
          <ul className="list-disc pl-4 m-0">
            {typologieDuProjet.map((t) => (
              <li key={t.typologie}>
                <div className="font-semibold">{getTypologieDuProjetLabel(t.typologie)}</div>
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
