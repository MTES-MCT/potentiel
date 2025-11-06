import { FC } from 'react';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';

import { DétailsChangementInstallateurPageProps } from './DétailsChangementInstallateur.page';

export type DétailsChangementInstallateurProps = {
  changement: DétailsChangementInstallateurPageProps['changement'];
};

export const DétailsChangementInstallateur: FC<DétailsChangementInstallateurProps> = ({
  changement,
}) => {
  return (
    <DétailsChangement
      title="Changement d'installateur"
      changement={changement}
      valeurs={
        <div>
          <span className="font-medium">Nouvel installateur</span> : {changement.installateur}
        </div>
      }
      statut="information-enregistrée"
    />
  );
};
