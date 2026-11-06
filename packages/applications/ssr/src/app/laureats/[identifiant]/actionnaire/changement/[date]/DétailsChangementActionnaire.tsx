import type { FC } from 'react';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';
import { DétailsDemande } from '@/components/organisms/demande/DétailsDemande';
import type { DétailsActionnairePageProps } from './DétailsActionnaire.page';

export type DétailsChangementActionnaireProps = Pick<DétailsActionnairePageProps, 'demande'>;

export const DétailsChangementActionnaire: FC<DétailsChangementActionnaireProps> = ({
  demande,
}) => {
  return demande.statut.statut === 'information-enregistrée' ? (
    <DétailsChangement
      valeurs={
        <DétailsValeursActionnaire
          nouvelActionnaire={demande.nouvelActionnaire}
          autoritéCompétente={demande.autoritéCompétente?.autoritéCompétente}
        />
      }
      changement={{
        enregistréPar: demande.demandéePar,
        enregistréLe: demande.demandéeLe,
        raison: demande.raison,
        pièceJustificative: demande.pièceJustificative,
      }}
      statut={demande.statut.statut}
    />
  ) : (
    <DétailsDemande
      demande={demande}
      valeurs={
        <DétailsValeursActionnaire
          nouvelActionnaire={demande.nouvelActionnaire}
          autoritéCompétente={demande.autoritéCompétente?.autoritéCompétente}
        />
      }
      statut={demande.statut.statut}
    />
  );
};

type Props = {
  nouvelActionnaire: string;
  autoritéCompétente?: string;
};

const DétailsValeursActionnaire: FC<Props> = ({ nouvelActionnaire, autoritéCompétente }: Props) => (
  <div className="flex flex-col gap-2">
    <div>
      <span className="font-medium">Nouvel actionnaire :</span> {nouvelActionnaire}
    </div>
    {autoritéCompétente && (
      <div>
        <span className="font-medium">Autorité compétente pour l'instruction :</span>{' '}
        {autoritéCompétente.toLocaleUpperCase()}
      </div>
    )}
  </div>
);
