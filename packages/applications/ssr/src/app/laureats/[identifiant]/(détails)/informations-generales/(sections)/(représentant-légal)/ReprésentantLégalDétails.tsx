import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { ChampObligatoireAvecAction } from '../../../../_helpers/types';

export type ReprésentantLégalDétailsProps = ChampObligatoireAvecAction<
  PlainType<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalReadModel>
>;

export const ReprésentantLégalDétails = ({ value, action }: ReprésentantLégalDétailsProps) => (
  <>
    <div className="flex flex-col gap-1">
      <span>{value.nomReprésentantLégal || 'Champ non renseigné'}</span>
      {action && <TertiaryLink href={action.url}>{action.label}</TertiaryLink>}
    </div>
  </>
);
