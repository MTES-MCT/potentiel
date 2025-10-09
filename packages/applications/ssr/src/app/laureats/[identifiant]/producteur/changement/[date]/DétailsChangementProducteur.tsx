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
      domaineLabel="producteur"
      changement={changement}
      détailsSpécifiques={<ProducteurChangé changement={changement} />}
    />
  );
};

const ProducteurChangé = ({
  changement,
}: {
  changement: DétailsProducteurPageProps['changement'];
}) => (
  <>
    <div>
      <span className="font-semibold">Nouveau producteur</span>: {changement.nouveauProducteur}
    </div>
    <div>
      <span className="font-semibold">Producteur initial</span>: {changement.ancienProducteur}
    </div>
  </>
);
