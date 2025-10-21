import { FC } from 'react';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';

import { DétailsProducteurPageProps } from './DétailsChangementProducteur.page';

export type DétailsChangementProducteurProps = {
  changement: DétailsProducteurPageProps['changement'];
};

export const DétailsChangementProducteur: FC<DétailsChangementProducteurProps> = ({
  changement,
}) => {
  return (
    <DétailsChangement
      title="Changement de producteur"
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
  <>
    <div>
      <span className="font-medium">Nouveau producteur</span>: {changement.nouveauProducteur}
    </div>
    <div>
      <span className="font-medium">Producteur initial</span>: {changement.ancienProducteur}
    </div>
  </>
);
