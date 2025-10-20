import { FC } from 'react';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';
import { DétailsDemande } from '@/components/organisms/demande/DétailsDemande';

import { DétailsActionnairePageProps } from './DétailsActionnaire.page';

export type DétailsChangementActionnaireProps = Pick<DétailsActionnairePageProps, 'demande'>;

export const DétailsChangementActionnaire: FC<DétailsChangementActionnaireProps> = ({
  demande,
}) => {
  return demande.statut.statut === 'information-enregistrée' ? (
    <DétailsChangement
      title="Changement d'actionnaire(s)"
      valeurs={<DétailsValeursActionnaire nouvelActionnaire={demande.nouvelActionnaire} />}
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
      valeurs={<DétailsValeursActionnaire nouvelActionnaire={demande.nouvelActionnaire} />}
      statut={demande.statut.statut}
      title="Demande de changement d'actionnaire(s)"
    />
  );
};

type Props = {
  nouvelActionnaire: string;
};

const DétailsValeursActionnaire: FC<Props> = ({ nouvelActionnaire }: Props) => (
  <div>
    <span className="font-medium">Nouvel actionnaire :</span> {nouvelActionnaire}
  </div>
);
