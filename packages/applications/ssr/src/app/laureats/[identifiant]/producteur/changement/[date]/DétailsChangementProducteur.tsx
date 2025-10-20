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
      détailsValeursDuDomaine={<DétailsValeursProducteur changement={changement} />}
      statut="information-enregistrée"
    />
  );
};

const DétailsValeursProducteur = ({
  changement,
}: {
  changement: DétailsProducteurPageProps['changement'];
}) => (
  <>
    <div>
      <span className="font-medium">Nouveau producteur</span>: {changement.nouveauProducteur}
    </div>
    <div>
      <span className="font-medium">Producteur initial</span>: {changement.ancienProducteur}
    </div>
  </>
);
