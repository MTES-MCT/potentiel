import { Candidature } from '@potentiel-domain/projet';

import { getTypologieInstallationLabel } from '@/app/laureats/[identifiant]/installation/typologie-du-projet/typologieInstallationLabel';

export const DétailTypologieInstallation = (
  typologieInstallation: Candidature.TypologieInstallation.RawType[],
) => {
  return (
    <>
      {typologieInstallation.length > 0 ? (
        <div className="flex flex-col gap-2">
          {typologieInstallation.map((t) => (
            <div key={t.typologie}>
              <div>
                Installation:{' '}
                <span className="font-semibold">{getTypologieInstallationLabel(t.typologie)}</span>
              </div>
              {t.détails && (
                <div className="italic">Éléments sous l'installation : {t.détails}</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <span>Typologie du projet non renseignée</span>
      )}
    </>
  );
};
