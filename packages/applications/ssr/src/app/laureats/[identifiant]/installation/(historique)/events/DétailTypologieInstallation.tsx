import { Candidature } from '@potentiel-domain/projet';

import { getTypologieInstallationLabel } from '@/app/laureats/[identifiant]/installation/typologie-du-projet/typologieInstallationLabel';

type DétailTypologieInstallationProps = {
  typologieInstallation: Candidature.TypologieInstallation.RawType[];
};
export const DétailTypologieInstallation = ({
  typologieInstallation,
}: DétailTypologieInstallationProps) => {
  return (
    <>
      {typologieInstallation.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {typologieInstallation.map((t) => (
            <div key={t.typologie}>
              <div>
                Installation : <span>{getTypologieInstallationLabel(t.typologie)}</span>
              </div>
              {t.détails && (
                <div className="italic">Éléments sous l'installation : {t.détails}</div>
              )}
            </div>
          ))}
        </ul>
      ) : (
        <span>Typologie du projet non renseignée</span>
      )}
    </>
  );
};
