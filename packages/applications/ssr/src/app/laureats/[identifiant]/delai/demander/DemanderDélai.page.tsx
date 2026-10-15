import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { DemanderDélaiForm, type DemanderDélaiFormProps } from './DemanderDélai.form';

export type DemanderDélaiPageProps = DemanderDélaiFormProps;

export const DemanderDélaiPage: FC<DemanderDélaiPageProps> = ({
  identifiantProjet,
  dateAchèvementPrévisionnelActuelle,
}) => (
  <div className="flex flex-col w-full">
    <Heading1>Demander un délai</Heading1>

    <DemanderDélaiForm
      identifiantProjet={identifiantProjet}
      dateAchèvementPrévisionnelActuelle={dateAchèvementPrévisionnelActuelle}
    />
  </div>
);
