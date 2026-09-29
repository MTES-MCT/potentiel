import type { FC } from 'react';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';
import type { DétailsProducteurPageProps } from './DétailsChangementProducteur.page';

export type DétailsChangementProducteurProps = {
  changement: DétailsProducteurPageProps['changement'];
};

export const DétailsChangementProducteur: FC<DétailsChangementProducteurProps> = ({
  changement,
}) => {
  return (
    <DétailsChangement
      changement={changement}
      valeurs={<DétailsValeursProducteur changement={changement} />}
      statut="information-enregistrée"
    />
  );
};

type DétailsValeursProducteurProps = {
  changement: DétailsProducteurPageProps['changement'];
};

const DétailsValeursProducteur: FC<DétailsValeursProducteurProps> = ({ changement }) => (
  <div className="flex flex-col gap-2 mb-2">
    <div className="flex flex-col gap-2">
      <div className="font-medium">Nouveau producteur</div>
      <div>
        <span className="font-medium">Nom</span> : {changement.nouveau.producteur}
      </div>
      <div>
        <span className="font-medium">SIRET</span> : {changement.nouveau.siret || 'Non renseigné'}
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <div className="font-medium">Producteur initial</div>
      <div>
        <span className="font-medium">Nom</span> : {changement.ancien.producteur}{' '}
      </div>

      <div>
        <span className="font-medium">SIRET</span> : {changement.ancien.siret ||
          'Non renseigné'}{' '}
      </div>
    </div>
  </div>
);
