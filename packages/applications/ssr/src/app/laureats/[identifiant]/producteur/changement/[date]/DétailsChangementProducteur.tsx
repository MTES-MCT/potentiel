import { FC } from 'react';

import { DétailsInformationEnregistrée } from '@/components/organisms/demande/DétailsInformationEnregistrée';

import { DétailsProducteurPageProps } from './DétailsChangementProducteur.page';

export type DétailsChangementProducteurProps = {
  changement: DétailsProducteurPageProps['changement'];
};

export const DétailsChangementProducteur: FC<DétailsChangementProducteurProps> = ({
  changement,
}) => {
  return (
    <DétailsInformationEnregistrée
      title="Changement de producteur"
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
      <span className="font-medium">Nouveau producteur</span>: {changement.nouveauProducteur}
    </div>
    <div>
      <span className="font-medium">Producteur initial</span>: {changement.ancienProducteur}
    </div>
  </>
);
