import React from 'react';

import { Candidature } from '@potentiel-domain/projet';

import { getTypologieDuProjetLabel } from '@/app/laureats/[identifiant]/installation/typologie-du-projet/typologieDuProjetLabel';

export const DétailTypologieDuProjet = (
  typologieDuProjet: Candidature.TypologieDuProjet.RawType[],
) => {
  const formatTypologieDuProjet = ({
    typologie,
    détails,
  }: Candidature.TypologieDuProjet.RawType) => (
    <>
      <div>{getTypologieDuProjetLabel(typologie)}</div>
      {détails && <div>Éléments sous l'installation : {détails}</div>}
    </>
  );
  return (
    <div>
      {typologieDuProjet.length > 1 ? (
        <>
          <div className="m-0">Installation mixte :</div>
          <ul className="list-disc pl-4 m-0">
            {typologieDuProjet.map((typologieDuProjet) => (
              <li key={typologieDuProjet.typologie}>
                {formatTypologieDuProjet(typologieDuProjet)}
              </li>
            ))}
          </ul>
        </>
      ) : typologieDuProjet.length === 1 ? (
        <div>{formatTypologieDuProjet(typologieDuProjet[0])}</div>
      ) : (
        <span>Typologie du projet non renseignée</span>
      )}
    </div>
  );
};
